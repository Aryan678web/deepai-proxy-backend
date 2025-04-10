require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
const upload = multer();
app.use(cors());

const apiKey = process.env.DEEPAI_API_KEY;

app.post('/convert', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided.' });
    }

    const form = new FormData();
    form.append('image', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    const response = await axios.post(
      'https://api.deepai.org/api/toonify',
      form,
      {
        headers: {
          ...form.getHeaders(),
          'Api-Key': apiKey,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({
      error: 'Conversion failed',
      details: error.response?.data || error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});￼Enter
