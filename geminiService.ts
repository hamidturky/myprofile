import { GoogleGenAI } from "@google/genai";
import { globalData } from "./data";
import { Language } from "./types";

export const getAIAssistance = async (query: string, lang: Language = 'en') => {
  if (!process.env.API_KEY) {
    console.error("Critical: Gemini API Key missing.");
    return lang === 'en' 
      ? "AI Assistant is currently offline due to configuration error. Please contact Hamid directly."
      : "مساعد الذكاء الاصطناعي غير متصل حالياً بسبب خطأ في التكوين. يرجى التواصل مع حامد مباشرة.";
  }

  try {
    // Initializing a new instance right before the call ensures the latest configuration is used.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
      - If you don't know an answer, suggest emailing Hamid at ${globalData.email}.
    `;

    // Using the simplified content string for a single text prompt as per SDK guidelines.
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        systemInstruction: context,
        temperature: 0.7,
        maxOutputTokens: 500,
        thinkingConfig: { thinkingBudget: 0 } // Explicitly disable thinking for low-latency response.
      },
    });

    // The result's text is accessed via the .text property.
    const responseText = response.text;
    if (!responseText) throw new Error("Empty AI Response");

    return responseText;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    
    // Graceful error handling for API quotas or service availability.
    if (error.message?.includes("429")) {
      return lang === 'en' ? "System busy. Please try again in a moment." : "النظام مشغول. يرجى المحاولة مرة أخرى بعد قليل.";
    }
    
    return lang === 'en' 
      ? "I encountered a processing error. Let's try another question."
      : "واجهت خطأ في المعالجة. دعنا نجرب سؤالاً آخر.";
  }
};