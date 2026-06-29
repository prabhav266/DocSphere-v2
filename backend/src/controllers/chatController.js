const { processChatMessage } = require("../services/aiService");

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

module.exports = {
  sendChatMessage,
};
