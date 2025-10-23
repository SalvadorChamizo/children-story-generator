import { model } from "./geminiClient";

export async function validateTextUntilValid(input: string): Promise<string> {
  const rules = `
Revisa y corrige el texto según estas reglas:
1. Debe tener al menos 500 palabras.
2. Debe estar estructurado en 3 partes.
3. No puede contener lenguaje ofensivo.
4. Debe contener al menos 3 personajes.
5. Debe ser un relato infantil para niños.
- "VALIDO" si cumple todos los requisitos.
- O el texto corregido si no los cumple.
  `;

  let text = input;
  let attempts = 0;


  while (attempts < maxAttempts) {
    const prompt = `${rules}\n\nTexto:\n${text}`;
    try{
        const result = await model.generateContent(prompt);
    }catch (e)
    const response = (await result.response.text()).trim();

    if (response.toUpperCase() === "VALIDO") {
      console.log("✅ Texto validado correctamente.");
      return text;
    }

    console.log(`⚙️ Intento ${attempts + 1}: texto corregido.`);
    text = response;
    attempts++;
  }

  console.warn("⚠️ No se pudo validar completamente tras varios intentos.");
  return text;
}