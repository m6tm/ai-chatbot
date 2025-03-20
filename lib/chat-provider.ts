import { OpenAI } from "openai";

// Configuration
const openai = new OpenAI({
    apiKey: process.env.GOOGLE_API_KEY, // Clé API Google Cloud
    baseURL: "https://generativelanguage.googleapis.com/v1beta",
    defaultHeaders: {
        "x-goog-api-key": process.env.GOOGLE_API_KEY!, // Header spécifique Google
    },
});

export async function callGemini() {
    try {
        const response = await openai.chat.completions.create({
            model: "gemini-pro", // Nom du modèle Gemini
            messages: [
                { role: "system", content: "Tu es un assistant IA" },
                { role: "user", content: "Explique la théorie de la relativité en termes simples" },
            ],
            max_tokens: 256,
        });

        console.log("Réponse Gemini :", response.choices[0].message.content);
    } catch (error) {
        console.error("Erreur :", error);
    }
}
