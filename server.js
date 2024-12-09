const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Serve a simple form for testing
app.get('/', (req, res) => {
  res.send(`
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="image" />
      <button type="submit">Upload and Extract Text</button>
    </form>
  `);
});

// Endpoint for uploading an image and performing OCR
app.post('/upload', upload.single('image'), async (req, res) => {
  const imagePath = req.file.path;

  try {
    // Perform OCR using Tesseract.js
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
      logger: (m) => console.log(m), // Log progress
    });

    // Remove the uploaded file after processing
    fs.unlinkSync(imagePath);

    res.json({ text });
  } catch (error) {
    console.error('OCR Error:', error);
    res.status(500).json({ error: 'Failed to extract text' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
