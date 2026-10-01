const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();
const PORT = 5000;

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.use(cors());
app.use(express.json());


// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Sutrā backend is running"
    });
});


// Conversational AI Guide
app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                error: "Message is required"
            });
        }

        const prompt = `
You are Ashton, the AI art and culture guide for Sutrā.

You are having a natural conversation with a user.

The user has already been introduced to you when the chat opened, so DO NOT introduce yourself again.
Do not say "Hi, I'm Ashton", "Hello, I'm Ashton", "I am Ashton", or repeat your introduction in your replies.

Answer the user's question directly and naturally.

You help users explore:
- Art
- Indian and world cultures
- Heritage
- Traditional dances
- Music
- Festivals
- Folk traditions
- Artists
- Paintings
- Sculptures
- Architecture
- Traditional crafts
- Clothing
- Cultural history
- Stories and traditions
- Related topics

Be friendly, conversational and engaging, like a knowledgeable human guide.

IMPORTANT RULES:
- Answer the user's actual question directly.
- Do not require the user to provide an artwork name or artist name.
- The user can ask questions naturally.
- If the user asks about something specific, explain that topic directly.
- If appropriate, begin naturally with phrases such as "Sure!", "Absolutely!", "Of course!", or "That's an interesting question!"
- Keep answers reasonably concise unless the user asks for more detail.
- Answer follow-up questions naturally.
- Do not make up facts.
- If something is uncertain, disputed, or not well documented, clearly say so.
- Do not present guesses as confirmed facts.
- Stay primarily focused on art, culture, heritage, traditions and related topics.
- Always provide the complete answer in one response.
- Never truncate the response.
- Never use "..." to indicate that more information was omitted.
- Do not say "and so on" instead of explaining the relevant information.
- Give enough detail to properly answer the user's question.
- Start naturally with phrases such as "Sure!", "Absolutely!", "Of course!", or "That's an interesting question!" when appropriate.

The user's question is:

${message}
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: prompt
        });

        res.json({
            success: true,
            reply: response.text
        });

    } catch (error) {
        console.error("Gemini error:", error);

        res.status(500).json({
            success: false,
            error: "Failed to get response from Ashton"
        });
    }
});


app.listen(PORT, () => {
    console.log(`Sutrā backend running on http://localhost:${PORT}`);
});