const fs = require("fs");
const { PDFParse } = require("pdf-parse");

const extractPdfText = async (filePath) => {
  let dataBuffer = null;
  try {
    // Read file into buffer
    dataBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    const result = await parser.getText();
    
    // Extract text and limit to 8000 chars to save memory
    const text = (result.text || "").slice(0, 8000);
    
    await parser.destroy();
    return text;
  } finally {
    // Explicitly free the buffer
    dataBuffer = null;
  }
};

module.exports = extractPdfText;
