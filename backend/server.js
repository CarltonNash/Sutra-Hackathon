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

app.get("/", (req, res) => {
    res.json({
        message: "Sutrā backend is running"
    });
});

app.post("/api/artwork-story", async (req, res) => {
    try {
        const { artworkName, artistName } = req.body;

        if (!artworkName) {
            return res.status(400).json({
                error: "Artwork name is required"
            });
        }

        const prompt = `
You are Sutrā, an AI art guide.

Write a complete, engaging explanation of the artwork below.

Artwork: ${artworkName}
Artist: ${artistName || "Unknown"}

Start exactly with:
"Namaste, I am Sutrā, your AI art guide. Let us explore this artwork."

Then provide ALL of these sections with actual content:

Title
Artist
Story
Cultural Context
Technique
Interesting Fact

Important:
- Write 2-4 sentences for Story.
- Write 2-3 sentences for Cultural Context.
- Write 1-2 sentences for Technique.
- Write 1 Interesting Fact.
- Do not use "..." or "to be continued".
- Do not leave any section empty.
- Do not invent facts. If a fact is uncertain or unknown, clearly say so.
- Return the complete response in one message.
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: prompt
        });

        console.log("FULL GEMINI RESPONSE:");
console.log(response.text);

res.json({
    success: true,
    artwork: artworkName,
    story: response.text
});

    } catch (error) {
        console.error("Gemini error:", error);

        res.status(500).json({
            success: false,
            error: "Failed to generate artwork story"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Sutrā backend running on http://localhost:${PORT}`);
});