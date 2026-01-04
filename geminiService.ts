import { GoogleGenAI } from "@google/genai";
import { globalData } from "./data";
import { Language } from "./types";

// Always initialize the client using the API_KEY from the environment variable process.env.API_KEY.
// Assume this variable is pre-configured and accessible in the execution context.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Provides AI assistance by querying the Gemini model with user context.
 * Adheres to the latest @google/genai coding guidelines.
 */
export const getAIAssistance = async (query: string, lang: Language = 'en') => {
  try {
    const profile = globalData.content[lang];
    
    const context = `
      You are an AI Professional Assistant for ${profile.name}. 
      Hamid is a highly skilled ${profile.title}.
      
      Resume data:
      Bio: ${profile.bio}
      Location: ${profile.location}
      Experience: ${JSON.stringify(profile.experience.map(e => ({ role: e.role, company: e.company })))}
      Skills: ${JSON.stringify(profile.skills)}
      
      Rules:
      - Reply in ${lang === 'en' ? 'English' : 'Arabic'}.
      - Keep responses concise and professional.
      - If you don't know an answer, suggest emailing Hamid at ${globalData.email}.
    `;

    // Use ai.models.generateContent directly with model name and prompt.
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        systemInstruction: context,
        temperature: 0.7,
        // When setting maxOutputTokens, a corresponding thinkingBudget must be set for Gemini 3 series models.
        maxOutputTokens: 500,
        thinkingConfig: { thinkingBudget: 250 },
      },
    });

    // Directly access the .text property of GenerateContentResponse (do not use text()).
    return response.text;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    // Robust error handling for rate limits and processing issues.
    if (error.message?.includes("429")) {
      return lang === 'en' ? "System busy. Please try again in a moment." : "النظام مشغول. يرجى المحاولة مرة أخرى بعد قليل.";
    }
    return lang === 'en' 
      ? "I encountered a processing error. Let's try another question."
      : "واجهت خطأ في المعالجة. دعنا نجرب سؤالاً آخر.";
  }
};
