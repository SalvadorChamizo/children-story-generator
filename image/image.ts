

import { GoogleGenAI, Modality } from "@google/genai";
import * as fs from "node:fs";

async function main() {
  const descripcion = process.argv.slice(2).join(" ");

  if (!descripcion) {
    console.error("Error1");
    console.error('   npx ts-node image.ts "formato valido"');
    process.exit(1);
  }

  const ai = new GoogleGenAI({});

  try {
    console.log("Generating image:");
    console.log(`   "${descripcion}"\n`);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: descripcion,
    });

    let imageSaved = false;
    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content?.parts;
      if (parts && Array.isArray(parts)) {
        for (const part of parts) {
          if (part.text) {
            console.log(part.text);
          } else if (part.inlineData && typeof part.inlineData.data === "string") {
            const imageData = part.inlineData.data;
            const filename = `generated-${Date.now()}.png`;
            const buffer = Buffer.from(imageData, "base64");
            fs.writeFileSync(filename, buffer);
            console.log(`image saved ${filename}`);
            imageSaved = true;
          }
        }
      }
    }
    if (!imageSaved) {
      console.log("No image generated.");
    }
  } catch (err) {
    console.error("Error generating image:", err);
  }
}

main();
