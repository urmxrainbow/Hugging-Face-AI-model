const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const HF_API_KEY = process.env.HF_API_KEY; // Load API Key from .env file
const MODEL_URL = "https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-R1"; // Hugging Face model

app.post("/generate", async (req, res) => {
    console.log("📩 Received request:", req.body.prompt);

    try {
        const response = await axios.post(
            MODEL_URL,
            { inputs: req.body.prompt },
            { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
        );

        console.log("✅ Hugging Face API Response:", response.data);

        if (response.data && response.data.length > 0 && response.data[0].generated_text) {
            res.json({ response: response.data[0].generated_text });
        } else {
            res.json({ response: "No text generated. Try again." });
        }
    } catch (error) {
        console.error("❌ API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Error processing request. Check backend logs for details." });
    }
});

const PORT = process.env.PORT || 5050;  // Change the port to 5050
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
