import { GoogleGenAI } from "@google/genai";
import express from "express";

const router = express.Router();

router.post("/generate-image", async (req, res) => {
  const { descripcion } = req.body;
  if (!descripcion) {
    return res.status(400).json({ error: "Missing descripcion" });
  }
  const ai = new GoogleGenAI({});
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: descripcion,
    });
    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content?.parts;
      if (parts && Array.isArray(parts)) {
        for (const part of parts) {
          if (part.inlineData && typeof part.inlineData.data === "string") {
            const imageData = part.inlineData.data;
            return res.json({ image: imageData });
          }
        }
      }
    }
    return res.status(500).json({ error: "No image generated" });
  } catch (err) {
    let errorMsg = 'Unknown error';
    if (err instanceof Error) {
      errorMsg = err.message;
    } else if (typeof err === 'string') {
      errorMsg = err;
    }
    return res.status(500).json({ error: errorMsg });
  }
});

export default router;
