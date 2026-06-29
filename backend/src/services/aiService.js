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
  const model = process.env.OPENAI_MODEL || "gpt-3.5-turbo";

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

const truncateText = (text, maxLength = 12000) => {
  if (!text) return "";
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const buildFallbackSummary = ({ title, description, fileType, extractedText }) => {
  const safeTitle = title?.trim() || "Untitled document";
  const safeDescription = description?.trim() || "No description provided.";
  const safeType = fileType || "document";
  const safeExcerpt = extractedText?.trim() ? extractedText.trim() : "";

  if (safeExcerpt) {
    return `${safeTitle} is a ${safeType} document about ${safeDescription}. The extracted content indicates the document covers: ${safeExcerpt.slice(0, 180)}${safeExcerpt.length > 180 ? "..." : ""}`;
  }

  return `${safeTitle} is a ${safeType} document with the following description: ${safeDescription}.`;
};

const requestOpenAi = async (payload) => {
  const { apiKey, apiBaseUrl, model } = getOpenAiConfig();

  if (!apiKey) {
    throw new Error("OpenAI API key is not configured. Set OPENAI_API_KEY in your environment.");
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
  const safeTitle = title?.trim() || "Untitled document";
  const safeDescription = description?.trim() || "No description provided.";
  const safeType = fileType || "document";
  const hasContent = extractedText && extractedText.trim().length > 0;

  const prompt = hasContent
    ? `You are an assistant that creates concise summaries for uploaded documents. Summarize the important information from the following document text into 2-3 short paragraphs, no more than 120 words. Keep the summary easy to read, include what the document is about, and do not include any analysis of the request.
    
    Document title: ${safeTitle}
    Document description: ${safeDescription}
    Document type: ${safeType}
    Document text:
    ${truncateText(extractedText, 12000)}`
    : `You are an assistant that creates a short summary for an uploaded document. Summarize the document using the available metadata only. Keep it under 80 words.

    Document title: ${safeTitle}
    Document description: ${safeDescription}
    Document type: ${safeType}`;

  try {
    const { model } = getOpenAiConfig();
    return await requestOpenAi({
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
  } catch (error) {
    return buildFallbackSummary({ title, description, fileType, extractedText });
  }
};

const processChatMessage = async (message, conversationId) => {
  const normalizedMessage = message?.trim() || "";

  if (!normalizedMessage) {
    return "Please provide a message to continue the conversation.";
  }

  return `Echo: ${normalizedMessage}`;
};

module.exports = {
  processChatMessage,
  generateDocumentSummary,
};
