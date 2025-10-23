import "dotenv/config";
import * as fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

async function main() {
  // Read prompt from command-line arguments
  const prompt = process.argv.slice(2).join(" ");

  if (!prompt) {
    console.error("Please provide a text prompt, e.g.:");
    console.error('   npx ts-node main.ts "A futuristic city under the ocean"');
    process.exit(1);
  }

  try {
    console.log("Generating image for prompt:");
    console.log(`   "${prompt}"\n`);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateImage({
      prompt,
      size: "1024x1024",
    });

    const imageBase64 = result.data[0].b64_json;
    const imageBytes = Buffer.from(imageBase64, "base64");
    const filename = `generated-${Date.now()}.png`;
    fs.writeFileSync(filename, imageBytes);

    console.log(`Image saved as ${filename}`);
  } catch (err) {
    console.error("Error generating image:", err);
  }
}

await main();
