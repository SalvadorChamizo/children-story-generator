import { GoogleGenAI } from "@google/genai";
import { generateStory } from "./api";
import { validateTextUntilValid } from "../backend/src/utils/CheckStory"

async function main() {
    const story = document.getElementById("generated-story")!;
    //const text = await generateStory();
    //story.textContent = await validateTextUntilValid(text);
    if (story)
        story.textContent = await generateStory();
}

await main();

