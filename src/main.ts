import { GoogleGenAI } from "@google/genai";
import { generateStory } from "./api";
import { validateTextUntilValid } from "../backend/src/utils/CheckStory"

const ai = new GoogleGenAI({});

async function main() {
    const story = document.getElementById("generated-story")!;
    const text = await generateStory();
    story.textContent = await validateTextUntilValid(text);
}

await main();

