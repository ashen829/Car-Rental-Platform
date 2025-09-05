// Middleware to handle multipart/form-data for image upload
const multer = require('multer');

// Store image in memory as buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
