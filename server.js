const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = '912g50FS7sx4PhnGAtmXGswHNG70TIsJ'; // Replace this with your actual DeepInfra API key

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files like index.html, images

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Chat API route
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
                    content: `You are a helpful assistant and expert on turban culture.`
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

        const data = await response.json();
        const reply = data?.choices?.[0]?.message?.content;

        if (!reply) {
            return res.status(200).json({ reply: "Sorry, I couldn't find an answer." });
        }

        res.json({ reply: reply.trim(), status: "success" });

    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ reply: "Something went wrong. Try again later." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at hhttps://turbanchronicles.onrender.com);
});