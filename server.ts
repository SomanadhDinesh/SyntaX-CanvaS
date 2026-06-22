import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3000", 10);

  app.use(express.json());

  // API Route for Auto-correction
  app.post("/api/correct", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Text is required" });
      }

      const prompt = `Please correct the grammar, spelling, and flow of the following tech blog draft. Maintain the original meaning and tone, and return ONLY the corrected text without any conversational filler or formatting blocks like \`\`\`:\n\n${text}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      res.json({ correctedText: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      const isOverloaded = error?.status === "UNAVAILABLE" || error?.code === 503;
      res.status(isOverloaded ? 503 : 500).json({ 
        error: isOverloaded 
          ? "The AI model is currently experiencing high demand. Please try again in a few moments." 
          : "Failed to process text" 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
