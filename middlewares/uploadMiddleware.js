const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary"); // ✅ Import properly

// ✅ Ensure cloudinary is initialized correctly
if (!cloudinary || !cloudinary.uploader) {
  throw new Error("Cloudinary is not configured correctly");
}

// Configure Multer Storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,  // ✅ Make sure `cloudinary` is passed correctly
  params: {
    folder: "profile_pictures",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 300, height: 300, crop: "fill" }],
  },
});

// Initialize Multer
const upload = multer({ storage });

module.exports = upload;
