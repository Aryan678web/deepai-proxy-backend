
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
const upload = multer({ dest: 'uploads/' });

app.post('/convert', upload.single('image'), async (req, res) => {
    const imagePath = req.file.path;

    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath));

    try {
        const response = await axios.post(
            'https://api.deepai.org/api/toonify',
            form,
            {
                headers: {
                    'Api-Key': 'YOUR_API_KEY_HERE',
                    ...form.getHeaders(),
                },
            }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Conversion failed', details: error.message });
    } finally {
        fs.unlinkSync(imagePath);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
