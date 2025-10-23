import { model } from "gemini-2.5-flash";
import { appendFileSync, existsSync, mkdirSync, writeFileSync } from "fs";

export async function validateTextUntilValid(input: string): Promise<string> {
  const rules = `
Revisa y corrige el texto según estas reglas:
1. Debe tener al menos 500 palabras.
2. Debe incluir estructura en 3 partes (presentación, nudo,
desenlace).
3. No puede contener lenguaje ofensivo.
4. Debe contener al menos 3 personajes.
5. Debe ser un relato infantil.
Responde solo con:
- "VALIDO" si cumple todos los requisitos.
- O el texto corregido si no los cumple.
  `;

  let text = input;
  let attempts = 0;

  const logDir = "./logs";
  if (!existsSync(logDir)) mkdirSync(logDir);

  while (true) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const prompt = `${rules}\n\nTexto:\n${text}`;

    try {
      const result = await model.generateContent(prompt);
      const response = (await result.response.text()).trim();

      const cleanResponse = response.replace(/[`\*_\n\r]+/g, "").trim();
      const isValid = cleanResponse.toUpperCase().startsWith("VALIDO");

      attempts++;
      const logFile = `${logDir}/intento_${attempts}_${timestamp}.log`;

      const logEntry = `
[${new Date().toISOString()}]
INTENTO: ${attempts}
PROMPT:
${prompt}

RESPUESTA:
${response}

RESULTADO: ${isValid ? "VALIDO ✅" : "CORREGIDO 🔁"}
====================================================
`;
      writeFileSync(logFile, logEntry, "utf-8");
      console.log(`🧾 Log guardado en: ${logFile}`);

      if (isValid) {
        console.log("✅ Texto validado correctamente.");
        return text;
      }

      console.log(`⚙️ Intento ${attempts}: el texto fue corregido.`);
      text = response;
    } catch (error: any) {
      const errLogFile = `${logDir}/error_${attempts + 1}_${timestamp}.log`;
      const errMsg = `[${new Date().toISOString()}] ❌ ERROR: ${error.message || error}\n`;
      writeFileSync(errLogFile, errMsg, "utf-8");
      console.error("Error en la llamada a Gemini:", error);
      console.log(`❗ Error registrado en: ${errLogFile}`);
    }
  }
}
