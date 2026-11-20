import {
  ABOUT_TEXT,
  EXPERIENCE,
  PROJECTS,
  SKILLS,
  SOCIALS
} from '../constants';

const REQUEST_TIMEOUT_MS = 22000;

function getOfflineFallbackResponse(prompt: string): string {
  const lower = prompt.toLowerCase().trim();

  if (lower === 'hi' || lower === 'hello' || lower === 'hey' || lower.startsWith('hi ') || lower.startsWith('hello ')) {
    return `Hello! I'm Rishad's terminal assistant. I can answer questions about my machine learning projects, skills, engineering background, and contact details. How can I help you today?`;
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
    return `You can reach me directly at:\n• Email: ${SOCIALS.email}\n• LinkedIn: ${SOCIALS.linkedin}\n• GitHub: ${SOCIALS.github}`;
  }

  if (lower.includes('experience') || lower.includes('work') || lower.includes('job') || lower.includes('company')) {
    const exp = EXPERIENCE.map(e => `• ${e.role} @ ${e.company} (${e.period})`).join('\n');
    return `My professional experience:\n\n${exp}\n\nType \`experience\` in the terminal to view complete timeline details.`;
  }

  if (lower.includes('about') || lower.includes('who are you') || lower.includes('rishad') || lower.includes('bio')) {
    return `${ABOUT_TEXT}\n\nFeel free to ask me anything about my projects, ML background, or how to get in touch!`;
  }

  return `I am Moniruzzaman Rishad's terminal assistant. I specialize in Machine Learning, Generative AI, and Software Engineering.\n\nTo explore my work, type \`help\`, \`projects\`, \`skills\`, or \`about\` in the terminal.`;
}

function formatApiErrorMessage(status: number, rawError?: string, code?: string): string {
  if (status === 400 || status === 403 || code === 'API_KEY_INVALID' || code === 'PERMISSION_DENIED') {
    return 'Gemini API authentication failed. Please check or update your API key in the Settings > Secrets panel.';
  }
  if (status === 429 || code === 'RESOURCE_EXHAUSTED') {
    return 'Gemini API rate limit or quota exceeded on the current tier. You can check usage or switch to a billing-enabled API key in the Settings > Secrets panel.';
  }
  if (status === 504 || code === 'TIMEOUT') {
    return 'Neural link timed out while waiting for a response. Please try again.';
  }
  return rawError || `Neural link request failed (HTTP ${status}).`;
}

export const generateAIResponse = async (prompt: string): Promise<string> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
      signal: controller.signal,
    });

    const rawText = await res.text();
    let parsed: { text?: string; error?: string; code?: string } | null = null;
    if (rawText) {
      try {
        parsed = JSON.parse(rawText);
      } catch {
        parsed = null;
      }
    }

    if (res.ok && parsed?.text) {
      return parsed.text;
    }

    // Pure static hosting where /api/chat route does not exist
    if (res.status === 404) {
      return getOfflineFallbackResponse(prompt);
    }

    // Propagate server-side API error cleanly so Terminal clears "... thinking ..." and displays the error
    throw new Error(formatApiErrorMessage(res.status, parsed?.error, parsed?.code));
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw new Error('Neural link timed out waiting for a response. Please try again.');
    }
    if (err instanceof Error && err.message) {
      throw err;
    }
    throw new Error('Unable to reach /api/chat. Please check your connection and try again.');
  } finally {
    clearTimeout(timeoutId);
  }
};
