import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyD3pWJp6GH0PbJwOjnDgbIFlRQ75_LcUpQ" });

const textarea = document.getElementById("textarea") as HTMLTextAreaElement | null;

export async function generateStory(): Promise<string> {
    const submitButton = document.getElementById("submit-button") as HTMLButtonElement | null;

    if (submitButton) {
        submitButton.addEventListener("click", async () => {
            if (textarea && textarea.value) {
                console.log("Textarea value:", textarea.value);

                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: `Generate a story for children with the following content: ${textarea.value}`,
                        config: {
                            systemInstruction: "You are a children' story writter. You will always assure your stories are valid for children between seven and twelve years old.",
                        },
                });
                console.log(response.text);
                textarea.innerHTML += response;
                const response2 = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: `Berify that this story is kid frindly, if not, try to find a way to turn it into a childs story: ${response.text}`,
                        config: {
                            systemInstruction: "You are a children' story writter. You will always assure your stories are valid for children between seven and twelve years old.",
                        },
                });
                console.log(response2.text);
                return (response.text);
            }
        })
    }
    return "";
}
