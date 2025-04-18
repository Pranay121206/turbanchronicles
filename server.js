// index.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.DEEPINFRA_API_KEY || '912g50FS7sx4PhnGAtmXGswHNG70TIsJ';

app.use(cors({
  origin: 'https://turbanchronicles.vercel.app' // Allow only your frontend
}));
app.use(express.json());

function generateLocalResponse(userInput) {
    return "I couldn't retrieve information about turbans at the moment. Did you know turbans have been worn for over 4,000 years across many cultures?";
}

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message?.trim();

    if (!userMessage) {
        return res.status(400).json({ reply: "Please enter a question." });
    }

    try {
        const body = {
            model: "meta-llama/Meta-Llama-3-70B-Instruct",
            messages: [
                {
                    role: "system",
                    content: `You are a helpful assistant and expert on turban culture. 
Answer questions clearly and concisely in 1–3 sentences about:
- Turban history, origins, and religious/cultural significance
- Styles, tying techniques, and regional variations
- Materials used and modern trends`
                },
                { role: "user", content: userMessage }
            ],
            temperature: 0.7,
            max_tokens: 300
        };

        const response = await fetch('https://api.deepinfra.com/v1/openai/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const raw = await response.text();

        let data;
        try {
            data = JSON.parse(raw);
        } catch (err) {
            return res.status(500).json({ reply: generateLocalResponse(userMessage) });
        }

        const reply = data?.choices?.[0]?.message?.content;
        if (!reply) {
            return res.status(200).json({
                reply: generateLocalResponse(userMessage),
                status: "no-message"
            });
        }

        res.json({ reply: reply.trim(), status: "success" });

    } catch (err) {
        return res.status(500).json({ reply: generateLocalResponse(userMessage) });
    }
});

app.get('/', (req, res) => {
  res.send('TurbanBot is running!');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
