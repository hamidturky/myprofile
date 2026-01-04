
import { GoogleGenAI } from "@google/genai";
import { globalData } from "./data";
import { Language } from "./types";

export const getAIAssistance = async (query: string, lang: Language = 'en') => {
  // Check if we are in a browser environment without a backend-injected API key
  const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : null;

  if (!apiKey) {
    console.error("Gemini API Key missing. This is expected on static hosts like GitHub Pages unless configured with a proxy.");
    return lang === 'en' 
      ? "I'm currently in 'Offline Mode'. To enable my AI capabilities on a public host, an API gateway is required. You can reach Hamid directly via the contact section!"
      : "أنا حالياً في 'وضع عدم الاتصال'. لتفعيل قدرات الذكاء الاصطناعي على استضافة عامة، يلزم وجود بوابة برمجية. يمكنك التواصل مع حامد مباشرة عبر قسم الاتصال!";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
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

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        systemInstruction: context,
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    });

    return response.text;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    if (error.message?.includes("429")) {
      return lang === 'en' ? "System busy. Please try again in a moment." : "النظام مشغول. يرجى المحاولة مرة أخرى بعد قليل.";
    }
    return lang === 'en' 
      ? "I encountered a processing error. Let's try another question."
      : "واجهت خطأ في المعالجة. دعنا نجرب سؤالاً آخر.";
  }
};
