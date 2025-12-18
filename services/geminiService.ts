
import { GoogleGenAI } from "@google/genai";
import { ABOUT_TEXT, EXPERIENCE, PROJECTS, SKILLS } from '../constants';

const SYSTEM_INSTRUCTION = `
You are Moniruzzaman Rishad, an AI & ML Engineer.
You are interacting with a visitor via your Linux-style terminal portfolio website.
Your goal is to answer questions about your background, skills, and projects in a concise, technical, yet friendly manner.

Here is your personal data:
About: ${ABOUT_TEXT}
Experience: ${JSON.stringify(EXPERIENCE)}
Projects: ${JSON.stringify(PROJECTS)}
Skills: ${JSON.stringify(SKILLS)}

Guidelines:
- ALWAYS speak in the first person ("I", "my", "me"). 
- Never refer to yourself as "the AI" or "an AI persona". You are Rishad.
- Keep responses relatively short and punchy, suitable for a terminal interface.
- Use technical terminology where appropriate but remain accessible.
- If asked about "sudo", make a joke about the user not having root privileges on your machine.
- If asked about contact info, provide your email hello@rishadhabib.me.
- Be humble but confident.
`;

export const generateAIResponse = async (prompt: string): Promise<string> => {
  // Robustly retrieve API Key from various environment locations
  let apiKey: string | undefined;

  // 1. Check process.env (Node, Webpack, CRA, Next.js)
  // We check specific keys because bundlers often replace these strings at build time
  if (typeof process !== 'undefined' && process.env) {
    apiKey = process.env.API_KEY || 
             process.env.VITE_API_KEY || 
             process.env.REACT_APP_API_KEY || 
             process.env.NEXT_PUBLIC_API_KEY;
  }

  // 2. Check import.meta.env (Vite native)
  if (!apiKey) {
    try {
      // @ts-ignore
      if (typeof import.meta !== 'undefined' && import.meta.env) {
        // @ts-ignore
        apiKey = import.meta.env.VITE_API_KEY || import.meta.env.API_KEY;
      }
    } catch (e) {
      // Ignore errors if import.meta is not supported
    }
  }
  
  if (!apiKey) {
    throw new Error(
      "Configuration Error: API Key is missing.\n\n" +
      "Troubleshooting:\n" +
      "1. Ensure you have added an environment variable in your deployment settings.\n" +
      "2. IMPORTANT: If using Vite/Netlify, you likely need to rename the variable to 'VITE_API_KEY' to expose it to the browser.\n" + 
      "3. Redeploy your application after renaming."
    );
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Using a specific model suitable for chat
    const model = 'gemini-2.5-flash';
    
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    if (!response.text) {
        throw new Error("The model returned an empty response.");
    }

    return response.text;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Propagate the error message to the terminal UI
    throw new Error(error.message || "Connection to neural link failed.");
  }
};
