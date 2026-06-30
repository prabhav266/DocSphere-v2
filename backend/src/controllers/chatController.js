const { processChatMessage, processDocumentQuestion } = require("../services/aiService");
const { getDocumentById } = require("../services/documentService");

const sendChatMessage = async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const reply = await processChatMessage(message, conversationId);

    res.status(200).json({
      reply,
      conversationId: conversationId || "default",
    });
  } catch (error) {
    console.error("CHAT CONTROLLER ERROR:", error);

    res.status(500).json({
      message: error.message || "Failed to process chat message",
    });
  }
};

const askDocumentQuestion = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    const document = await getDocumentById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.visibility === "private" && document.uploaded_by !== req.user?.id) {
      return res.status(403).json({ message: "Not authorized to ask about this document" });
    }

    const answer = await processDocumentQuestion({ question, document });

    res.status(200).json({
      answer,
      documentId: document.id,
    });
  } catch (error) {
    console.error("DOCUMENT QUESTION ERROR:", error);

    res.status(500).json({
      message: error.message || "Failed to answer document question",
    });
  }
};

module.exports = {
  sendChatMessage,
  askDocumentQuestion,
};
