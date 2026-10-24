import { GoogleGenAI } from '@google/genai';
import { 
  SYSTEM_INSTRUCTION, 
  ABOUT_TEXT, 
  EXPERIENCE, 
  PROJECTS, 
  SKILLS, 
  SOCIALS 
} from '../constants';

export const generateAIResponse = async (prompt: string): Promise<string> => {
  // 1. Try server endpoint (/api/chat on Express dev/prod or Netlify serverless function via redirect)
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (res.ok) {
      const text = await res.text();
      if (text && text.trim().length > 0) {
        try {
          const data = JSON.parse(text);
          if (data.text) return data.text;
        } catch {
          // not JSON, fall through
        }
      }
    } else if (res.status !== 404 && res.status !== 502) {
      // If server responded with a specific API error message (e.g. rate limit), parse and check
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        if (data.error && !data.error.includes('Cannot POST') && !data.error.includes('not found')) {
          console.warn('Backend returned error:', data.error);
        }
      } catch {
        // ignore JSON parse
      }
    }
  } catch (err: any) {
    console.warn('API route /api/chat unreachable, falling back...', err?.message);
  }

  // 2. Client-Side Fallback: Check if VITE_API_KEY or VITE_GEMINI_API_KEY is available (standard for Netlify/Vercel)
  const clientKey = (import.meta as any).env?.VITE_API_KEY || 
                    (import.meta as any).env?.VITE_GEMINI_API_KEY || 
                    (import.meta as any).env?.GEMINI_API_KEY ||
                    (typeof window !== 'undefined' && (window as any).__GEMINI_API_KEY__);

  if (clientKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey: clientKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-2.5-flash'];
      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
            }
          });
          if (response.text) {
            return response.text;
          }
        } catch (mErr) {
          console.warn(`Model ${model} attempt failed:`, mErr);
        }
      }
    } catch (clientErr: any) {
      console.error('Client Gemini fallback error:', clientErr);
    }
  }

  // 3. Intelligent Offline Knowledge Fallback (Guarantees zero 404 crashes on static hosts)
  const lower = prompt.toLowerCase().trim();

  if (lower === 'hi' || lower === 'hello' || lower === 'hey' || lower.startsWith('hi ') || lower.startsWith('hello ')) {
    return `Hello! I'm Rishad's AI terminal assistant. I can answer questions about my machine learning projects, skills, engineering background, and contact details. How can I help you today?\n\n*(Note: To enable live dynamic Gemini AI generation on Netlify, add 'GEMINI_API_KEY' or 'VITE_API_KEY' in your Netlify site settings > Environment variables)*`;
  }

  if (lower.includes('project')) {
    const list = PROJECTS.slice(0, 3).map(p => `• ${p.name}: ${p.tagline || p.description} (Tech: ${p.tech.slice(0, 3).join(', ')})`).join('\n');
    return `Here are some of my highlighted AI & ML projects:\n\n${list}\n\nType \`projects\` in the terminal to open the interactive 3D Projects Showcase!`;
  }

  if (lower.includes('skill') || lower.includes('stack')) {
    const categories = SKILLS.map(s => `• ${s.category}: ${s.skills.slice(0, 5).join(', ')}...`).join('\n');
    return `My technical skills overview:\n\n${categories}\n\nType \`skills\` or \`cat skills.txt\` to view the complete skill tree.`;
  }

  if (lower.includes('contact') || lower.includes('email') || lower.includes('hire') || lower.includes('reach') || lower.includes('message')) {
    return `You can reach me directly at:\n• Email: hello@rishadhabib.me (or ${SOCIALS.email})\n• LinkedIn: ${SOCIALS.linkedin}\n• GitHub: ${SOCIALS.github}`;
  }

  if (lower.includes('experience') || lower.includes('work') || lower.includes('job') || lower.includes('company')) {
    const exp = EXPERIENCE.map(e => `• ${e.role} @ ${e.company} (${e.period})`).join('\n');
    return `My professional experience:\n\n${exp}\n\nType \`experience\` in the terminal to view complete timeline details.`;
  }

  if (lower.includes('about') || lower.includes('who are you') || lower.includes('rishad') || lower.includes('bio')) {
    return `${ABOUT_TEXT}\n\nFeel free to ask me anything about my projects, ML background, or how to get in touch!`;
  }

  return `I am Moniruzzaman Rishad's terminal assistant. I specialize in Machine Learning, Generative AI, and Software Engineering.\n\nTo explore my work, type \`help\`, \`projects\`, \`skills\`, or \`about\` in the terminal.\n\n*(Note: To enable live freeform Gemini AI on Netlify, please add 'GEMINI_API_KEY' or 'VITE_API_KEY' in Netlify Site Configuration > Environment variables)*`;
};
