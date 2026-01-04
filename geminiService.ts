import { GoogleGenAI } from "@google/genai";
import { globalData } from "./data";
import { Language } from "./types";

/**
 * Provides AI assistance by querying the Gemini model with user context.
 * Optimized for recruitment and job readiness.
 */
export const getAIAssistance = async (query: string, lang: Language = 'en') => {
  // Create a new instance right before making an API call to ensure it always uses the most up-to-date API key from the environment.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const profile = globalData.content[lang];
    const socials = globalData.socials;
    
    const context = `
      You are the Professional AI Advocate for ${profile.name}, a highly skilled ${profile.title}.
      Your primary goal is to help recruiters and collaborators understand why Hamid is the perfect candidate for Information Security and IT roles.

      HAMID'S CORE PROFILE:
      - Academic: M.Sc. in Computer Systems Information Security (ITMO University, Russia), B.Sc. in Computer Science (EIT).
      - Status: Actively seeking opportunities and ready to join immediately.
      - Bio: ${profile.bio}
      
      HAMID'S SKILLS:
      ${JSON.stringify(profile.skills)}

      HAMID'S FULL EXPERIENCE:
      ${JSON.stringify(profile.experience)}

      PROJECTS & CERTIFICATES:
      - Projects: ${JSON.stringify(profile.projects.map(p => p.title + ": " + p.description))}
      - Certs: ${JSON.stringify(profile.certificates.map(c => c.name))}

      CONTACT INFORMATION (Share these if asked for contact/call/message):
      - Email: ${globalData.email}
      - LinkedIn: ${socials.linkedin}
      - GitHub: ${socials.github}
      - Telegram: ${socials.telegram || 'Available on request'}
      - WhatsApp: ${socials.whatsapp || 'Available on request'}
      - Location: ${profile.location}

      RESPONSE GUIDELINES:
      1. Use a professional, confident, and helpful tone.
      2. If asked about experience, summarize the relevant part of his career (EIT Graduate Assistant, ITMO Research, or Freelance).
      3. If asked about contact details, provide the email and relevant social links.
      4. Always highlight that he is ready for new professional challenges.
      5. Reply in ${lang === 'en' ? 'English' : 'Arabic'}.
    `;

    // Use gemini-3-flash-preview for fast and helpful Q&A.
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        systemInstruction: context,
        temperature: 0.7,
        // Removed maxOutputTokens and thinkingConfig to let the model decide the best response length and reasoning steps.
      },
    });

    // Directly access the .text property from GenerateContentResponse.
    return response.text ?? "";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    if (error.message?.includes("429")) {
      return lang === 'en' ? "System busy. Please try again in a moment." : "النظام مشغول. يرجى المحاولة مرة أخرى بعد قليل.";
    }
    return lang === 'en' 
      ? "I encountered an error. Please reach out to Hamid directly at " + globalData.email
      : "واجهت خطأ. يرجى التواصل مع حامد مباشرة عبر " + globalData.email;
  }
};