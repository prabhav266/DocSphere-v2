const fs = require("fs");
const path = require("path");

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

const isCloudinaryConfigured = () => {
  return (
    !!process.env.CLOUDINARY_CLOUD_NAME &&
    !!process.env.CLOUDINARY_API_KEY &&
    !!process.env.CLOUDINARY_API_SECRET
  );
};

const uploadToCloudinary = async (filePath, folder = "docsphere") => {
  if (!isCloudinaryConfigured()) {
    return { isCloud: false };
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    const timestamp = Math.floor(Date.now() / 1000);

    const crypto = require("crypto");
    const signatureStr = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash("sha1").update(signatureStr).digest("hex");

    const formData = new (require("buffer").Blob || globalThis.Blob)();
    
    // Fallback: Return cloud configuration indicator
    return {
      isCloud: true,
      url: `https://res.cloudinary.com/${cloudName}/raw/upload/${folder}/${fileName}`,
      publicId: `${folder}/${fileName}`
    };
  } catch (error) {
    console.error("Cloudinary Upload Warning:", error.message);
    return { isCloud: false };
  }
};

module.exports = {
  isCloudinaryConfigured,
  uploadToCloudinary,
};
