import { GoogleGenAI } from '@google/genai';
import { SYSTEM_INSTRUCTION } from '../constants';

export const generateAIResponse = async (prompt: string): Promise<string> => {
  try {
    // Check for client-side API keys (e.g., Netlify VITE_API_KEY or VITE_GEMINI_API_KEY)
    const clientApiKey = 
      (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) ||
      (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) ||
      (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.GEMINI_API_KEY);

    if (clientApiKey) {
      const ai = new GoogleGenAI({
        apiKey: clientApiKey,
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      if (!response.text) {
        throw new Error('The model returned an empty response.');
      }

      return response.text;
    }

    // Otherwise, call backend proxy /api/chat (for full-stack dev / production container)
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const text = await res.text();
    let data: any = {};
    
    if (text && text.trim().length > 0) {
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        console.error('Failed to parse response JSON:', text);
        throw new Error('Server returned an invalid or unparseable response.');
      }
    } else if (res.status === 404) {
      throw new Error('API route not found. If deploying statically (e.g. Netlify), please define VITE_API_KEY in environment variables.');
    }

    if (!res.ok) {
      throw new Error(data.error || `Server error (${res.status})`);
    }

    if (!data.text) {
      throw new Error('The model returned an empty response.');
    }

    return data.text;
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    throw new Error(error.message || 'Connection to neural link failed.');
  }
};


