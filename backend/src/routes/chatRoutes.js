const express = require("express");
const { sendChatMessage, askDocumentQuestion } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", sendChatMessage);
router.post("/documents/:id", protect, askDocumentQuestion);

module.exports = router;
