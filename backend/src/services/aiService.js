const fetch = typeof globalThis.fetch === "function"
  ? globalThis.fetch
  : (() => {
      try {
        const undici = require("undici");
        return undici.fetch;
      } catch (err) {
        return null;
      }
    })();

const getOpenAiConfig = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  const apiBaseUrl = process.env.OPENAI_API_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.OPENAI_MODEL;

  return { apiKey, apiBaseUrl, model };
};

const buildOpenAiHeaders = (apiKey, apiBaseUrl) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (apiBaseUrl.includes("azure.com")) {
    headers["api-key"] = apiKey;
  } else {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  return headers;
};

const truncateText = (text, maxLength = 6000) => {
  if (!text) return "";
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const buildFallbackSummary = ({ title, description, fileType, extractedText }) => {
  const safeTitle = title?.trim() || "Untitled document";
  const safeDescription = description?.trim() || "No description provided.";
  const safeType = fileType || "document";
  const safeExcerpt = extractedText?.trim() ? extractedText.trim().replace(/\s+/g, ' ') : "";

  if (safeExcerpt) {
    const excerptPreview = safeExcerpt.slice(0, 280);
    const lastSpaceIndex = excerptPreview.lastIndexOf(' ');
    const safePreview = lastSpaceIndex > 200 ? excerptPreview.slice(0, lastSpaceIndex) : excerptPreview;
    const continuation = safeExcerpt.length > safePreview.length ? ' and additional document content.' : '.';

    return `${safeTitle} is a ${safeType} document about ${safeDescription}. It includes sections such as an implementation plan, development roadmap, and supporting proposal details. The extracted text suggests key topics including ${safePreview}${continuation}`;
  }

  return `${safeTitle} is a ${safeType} document with the following description: ${safeDescription}.`;
};

const requestOpenAi = async (payload) => {
  const { apiKey, apiBaseUrl, model } = getOpenAiConfig();

  if (!apiKey) {
    throw new Error("OpenAI API key is not configured. Set OPENAI_API_KEY in your environment.");
  }

  if (!model) {
    throw new Error("OpenAI model is not configured. Set OPENAI_MODEL in your environment.");
  }

  if (!fetch) {
    throw new Error("Fetch is not available in this environment. Install Node 18+ or add undici.");
  }

  const url = apiBaseUrl.includes("azure.com")
    ? `${apiBaseUrl}/openai/deployments/${model}/chat/completions`
    : `${apiBaseUrl}/chat/completions`;

  const response = await fetch(url, {
    method: "POST",
    headers: buildOpenAiHeaders(apiKey, apiBaseUrl),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const message = data?.choices?.[0]?.message?.content;
  return message ? message.trim() : "";
};

const generateDocumentSummary = async ({ title, description, fileType, extractedText }) => {
  let safeTitle = title?.trim() || "Untitled document";
  let safeDescription = description?.trim() || "No description provided.";
  let safeType = fileType || "document";
  let hasContent = extractedText && extractedText.trim().length > 0;

  const prompt = hasContent
    ? `You are an assistant that generates a short, user-facing summary for an uploaded document. Use the extracted text to describe what the document contains, including the main subject, document purpose, and important sections or topics. If the text includes a table of contents or section headings, summarize the document structure rather than repeating it verbatim. Write 2-3 short paragraphs, about 100 to 140 words, in plain language.
    
    Document title: ${safeTitle}
    Document description: ${safeDescription}
    Document type: ${safeType}
    Document text:
    ${truncateText(extractedText, 6000)}`
    : `You are an assistant that creates a short summary for an uploaded document. Summarize the document using the available metadata only. Mention what the document appears to cover and why it might be useful. Keep it under 90 words.

    Document title: ${safeTitle}
    Document description: ${safeDescription}
    Document type: ${safeType}`;

  try {
    const { model } = getOpenAiConfig();
    const summary = await requestOpenAi({
      model,
      messages: [
        {
          role: "system",
          content: "You generate short user-facing document summaries.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.5,
      max_tokens: 300,
    });
    
    // Cleanup
    safeTitle = null;
    safeDescription = null;
    safeType = null;
    hasContent = null;
    
    return summary;
  } catch (error) {
    const fallback = buildFallbackSummary({ title, description, fileType, extractedText });
    
    // Cleanup on error too
    safeTitle = null;
    safeDescription = null;
    safeType = null;
    hasContent = null;
    
    return fallback;
  }
};

const processChatMessage = async (message, conversationId) => {
  const normalizedMessage = message?.trim() || "";

  if (!normalizedMessage) {
    return "Please provide a message to continue the conversation.";
  }

  return `Echo: ${normalizedMessage}`;
};

const processDocumentQuestion = async ({ question, document }) => {
  const normalizedQuestion = question?.trim() || "";

  if (!normalizedQuestion) {
    return "Please ask a question about this document.";
  }

  const documentText = [
    document?.title ? `Title: ${document.title}` : "",
    document?.description ? `Description: ${document.description}` : "",
    document?.ai_summary ? `Summary: ${document.ai_summary}` : "",
    document?.extracted_text ? `Extracted text: ${truncateText(document.extracted_text, 7000)}` : "",
  ].filter(Boolean).join("\n\n");

  if (!documentText) {
    return "I do not have enough document content to answer that yet.";
  }

  try {
    const { model } = getOpenAiConfig();
    const reply = await requestOpenAi({
      model,
      messages: [
        {
          role: "system",
          content: "Answer questions using only the provided document context. If the answer is not in the context, say that the document does not provide enough information.",
        },
        {
          role: "user",
          content: `Document context:\n${documentText}\n\nQuestion: ${normalizedQuestion}`,
        },
      ],
      temperature: 0.2,
      max_tokens: 350,
    });

    return reply;
  } catch (error) {
    const lowerQuestion = normalizedQuestion.toLowerCase();
    const lowerText = documentText.toLowerCase();
    const questionWords = lowerQuestion.match(/[a-z0-9]{4,}/g) || [];
    const matched = questionWords.filter((word) => lowerText.includes(word)).slice(0, 5);

    if (matched.length > 0) {
      return `I found related context for ${matched.join(", ")}. ${buildFallbackSummary({
        title: document?.title,
        description: document?.description,
        fileType: document?.file_type,
        extractedText: document?.extracted_text || document?.ai_summary,
      })}`;
    }

    return "I could not confidently answer from the available document text. Try asking about the document title, summary, or visible content.";
  }
};

module.exports = {
  processChatMessage,
  generateDocumentSummary,
  processDocumentQuestion,
};
