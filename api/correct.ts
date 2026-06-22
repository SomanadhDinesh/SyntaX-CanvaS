import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  // Allow CORS if needed, or just handle POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
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
        : "Failed to process text",
    });
  }
}
