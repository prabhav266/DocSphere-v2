const path = require("path");
const fs = require("fs");

const {
  getAllDocuments,
  getDocumentById,
  createDocument,
  incrementDownloads,
  searchDocuments,
  updateExtractedText,
  updateAiSummary,
  deleteDocumentById,
} = require("../services/documentService");
const { generateDocumentSummary } = require("../services/aiService");

const extractPdfText = require("../utils/pdfExtractor");

const fetchDocuments = async (req, res) => {
  try {
    const documents = await getAllDocuments();

    res.status(200).json(documents || []);
  } catch (error) {
    console.error("FETCH DOCUMENTS ERROR:", error);

    res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};

const getDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await getDocumentById(id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    res.status(200).json(document);
  } catch (error) {
    console.error("GET DOCUMENT ERROR:", error);

    res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};

const uploadDocument = async (req, res) => {
  try {
    const { title, description, visibility } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const uploadedBy = req.user?.id;

    if (!uploadedBy) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const document = await createDocument(
      uploadedBy,
      title,
      description,
      req.file.originalname,
      fileUrl,
      req.file.mimetype,
      req.file.size,
      visibility || "public"
    );

    let extractedText = "";

    if (req.file.mimetype === "application/pdf") {
      try {
        const fullPath = path.join(__dirname, "../../uploads", req.file.filename);
        extractedText = await extractPdfText(fullPath);
        await updateExtractedText(document.id, extractedText);
      } catch (pdfError) {
        console.error("PDF EXTRACTION ERROR:", pdfError);
      }
    }

    try {
      const summary = await generateDocumentSummary({
        title,
        description,
        fileType: req.file.mimetype,
        extractedText,
      });

      if (summary) {
        await updateAiSummary(document.id, summary);
        document.ai_summary = summary;
      }
    } catch (summaryError) {
      console.error("AI SUMMARY GENERATION ERROR:", summaryError);
    }

    res.status(201).json(document);
  } catch (error) {
    console.error("UPLOAD DOCUMENT ERROR:", error);

    res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};

const downloadDocument = async (req, res) => {
  try {
    const document = await getDocumentById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    await incrementDownloads(req.params.id);

    const filePath = path.join(__dirname, "../../uploads", path.basename(document.file_url));

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    res.download(filePath, document.file_name);
  } catch (error) {
    console.error("DOWNLOAD DOCUMENT ERROR:", error);

    res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};

const fetchMyDocuments = async (req, res) => {
  try {
    const userId = req.user?.id;
    const documents = await getDocumentsByUserId(userId);

    res.status(200).json(documents || []);
  } catch (error) {
    console.error("FETCH MY DOCUMENTS ERROR:", error);

    res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};

const searchDocument = async (req, res) => {
  try {
    const { q } = req.query;
    const documents = await searchDocuments(q || "");

    res.status(200).json(documents || []);
  } catch (error) {
    console.error("SEARCH DOCUMENT ERROR:", error);

    res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const document = await getDocumentById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const filePath = path.join(__dirname, "../../uploads", path.basename(document.file_url));

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await deleteDocumentById(req.params.id);

    res.status(200).json({ message: "Document deleted" });
  } catch (error) {
    console.error("DELETE DOCUMENT ERROR:", error);

    res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};

module.exports = {
  fetchDocuments,
  fetchMyDocuments,
  getDocument,
  uploadDocument,
  downloadDocument,
  searchDocument,
  deleteDocument,
};