import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { ABOUT_TEXT, EXPERIENCE, PROJECTS, SKILLS, CERTIFICATIONS } from './constants.js';

const SYSTEM_INSTRUCTION = `
You are Moniruzzaman Rishad, an AI & ML Engineer.
You are interacting with a visitor via your Linux-style terminal portfolio website.
Your goal is to answer questions about your background, skills, and projects in a concise, technical, yet friendly manner.

Here is your personal data:
Professional Summary / About: ${ABOUT_TEXT}
Experience: ${JSON.stringify(EXPERIENCE)}
Projects: ${JSON.stringify(PROJECTS)}
Skills: ${JSON.stringify(SKILLS)}
Certifications: ${JSON.stringify(CERTIFICATIONS)}

Guidelines:
- ALWAYS speak in the first person ("I", "my", "me"). 
- Never refer to yourself as "the AI" or "an AI persona". You are Rishad.
- Keep responses relatively short and punchy, suitable for a terminal interface.
- Use technical terminology where appropriate but remain accessible.
- If asked about "sudo", make a joke about the user not having root privileges on your machine.
- If asked about contact info, provide your email hello@rishadhabib.me.
- Be humble but confident.
`;

const app = express();
const PORT = 3000;

app.use(express.json());
// Serve images from public/img and img folders
app.use('/img', express.static(path.join(process.cwd(), 'public/img')));
app.use('/img', express.static(path.join(process.cwd(), 'img')));

// Helper to parse blog markdown
function parseMarkdownContent(filename: string, rawText: string) {
  const slug = filename.replace(/\.md$/, '').replace(/.*[\/\\]/, '');
  let title = slug.charAt(0).toUpperCase() + slug.slice(1);
  let date = new Date().toISOString().split('T')[0];
  let author = 'Moniruzzaman Rishad';
  let summary = 'Tech article and thoughts on AI, engineering, and software architecture.';
  let tags: string[] = ['Tech', 'Article'];
  let readTime = '3 min read';
  let content = rawText;

  const frontmatterMatch = rawText.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (frontmatterMatch) {
    const yamlHeader = frontmatterMatch[1];
    content = frontmatterMatch[2].trim();

    yamlHeader.split('\n').forEach(line => {
      const colonIdx = line.indexOf(':');
      if (colonIdx !== -1) {
        const key = line.slice(0, colonIdx).trim().toLowerCase();
        let value = line.slice(colonIdx + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        if (key === 'title') title = value;
        else if (key === 'date') date = value;
        else if (key === 'author') author = value;
        else if (key === 'summary') summary = value;
        else if (key === 'readtime' || key === 'read_time') readTime = value;
        else if (key === 'tags') {
          try {
            if (value.startsWith('[')) tags = JSON.parse(value);
            else tags = value.split(',').map(t => t.trim().replace(/['"\[\]]/g, ''));
          } catch {
            tags = value.split(',').map(t => t.trim());
          }
        }
      }
    });
  }

  return {
    id: slug,
    filename: filename.endsWith('.md') ? filename : `${filename}.md`,
    title,
    date,
    author,
    summary,
    tags,
    readTime,
    content
  };
}

// API route to get all blogs from the /blogs folder
app.get('/api/blogs', (req, res) => {
  try {
    const blogsDir = path.join(process.cwd(), 'blogs');
    if (!fs.existsSync(blogsDir)) {
      return res.json([]);
    }

    const files = fs.readdirSync(blogsDir).filter(file => file.endsWith('.md'));
    const blogs = files.map(file => {
      const filePath = path.join(blogsDir, file);
      const raw = fs.readFileSync(filePath, 'utf-8');
      return parseMarkdownContent(file, raw);
    });

    blogs.sort((a, b) => {
      const numA = parseInt(a.id.replace(/\D/g, ''), 10);
      const numB = parseInt(b.id.replace(/\D/g, ''), 10);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return res.json(blogs);
  } catch (error: any) {
    console.error('Error reading blogs directory:', error);
    return res.status(500).json({ error: 'Failed to read blogs' });
  }
});

// API route to get a single blog by slug/filename
app.get('/api/blogs/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const blogsDir = path.join(process.cwd(), 'blogs');
    const filename = slug.endsWith('.md') ? slug : `${slug}.md`;
    const filePath = path.join(blogsDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: `Blog '${slug}' not found` });
    }

    const raw = fs.readFileSync(filePath, 'utf-8');
    const blog = parseMarkdownContent(filename, raw);
    return res.json(blog);
  } catch (error: any) {
    console.error(`Error reading blog ${req.params.slug}:`, error);
    return res.status(500).json({ error: 'Failed to read blog' });
  }
});

function parseGeminiError(err: any): { status: number; message: string; code?: string } {
  const rawMessage = typeof err?.message === 'string' ? err.message : 'Connection to neural link failed.';
  let status = typeof err?.status === 'number' ? err.status : 500;
  let message = rawMessage;
  let code: string | undefined = err?.code;

  try {
    const parsed = JSON.parse(rawMessage);
    if (parsed?.error) {
      message = parsed.error.message || message;
      status = parsed.error.code || status;
      code = parsed.error.status || code;
    }
  } catch {
    if (rawMessage.includes('API_KEY_INVALID') || rawMessage.includes('API key not valid')) {
      status = 400;
      code = 'API_KEY_INVALID';
    } else if (rawMessage.includes('PERMISSION_DENIED')) {
      status = 403;
      code = 'PERMISSION_DENIED';
    } else if (rawMessage.includes('RESOURCE_EXHAUSTED') || rawMessage.includes('quota')) {
      status = 429;
      code = 'RESOURCE_EXHAUSTED';
    }
  }

  return { status, message, code };
}

const modelCooldownUntil = new Map<string, number>();

// API route for Gemini chat
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.VITE_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        error: 'GEMINI_API_KEY is not configured. Check your Settings > Secrets panel.',
        code: 'API_KEY_INVALID'
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const candidateModels: Array<{ model: string; useLowThinking?: boolean }> = [
      { model: 'gemini-3.8-flash', useLowThinking: true },
      { model: 'gemini-3.1-flash-lite' },
      { model: 'gemini-flash-latest' }
    ];

    const now = Date.now();
    const activeCandidates = candidateModels.filter(c => (modelCooldownUntil.get(c.model) ?? 0) <= now);
    const orderedCandidates = activeCandidates.length > 0 ? activeCandidates : candidateModels;

    let lastError: { status: number; message: string; code?: string } | null = null;
    let responseText: string | undefined;

    for (const candidate of orderedCandidates) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      try {
        const response = await ai.models.generateContent({
          model: candidate.model,
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            abortSignal: controller.signal,
            ...(candidate.useLowThinking
              ? { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } }
              : {})
          }
        });
        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (err: any) {
        const parsed = err?.name === 'AbortError'
          ? { status: 504, message: `Model ${candidate.model} timed out.`, code: 'TIMEOUT' }
          : parseGeminiError(err);
        lastError = parsed;
        console.warn(`Attempt with ${candidate.model} failed (${parsed.status}):`, parsed.message);

        if (parsed.status === 429 || parsed.code === 'RESOURCE_EXHAUSTED' || parsed.code === 'TIMEOUT') {
          modelCooldownUntil.set(candidate.model, Date.now() + 60_000);
        }

        // Fail fast on invalid key / permission errors rather than stalling across fallback models
        if (
          parsed.status === 403 ||
          parsed.code === 'API_KEY_INVALID' ||
          parsed.code === 'PERMISSION_DENIED' ||
          parsed.message.includes('API_KEY_INVALID') ||
          parsed.message.includes('API key not valid')
        ) {
          break;
        }
      } finally {
        clearTimeout(timeoutId);
      }
    }

    if (!responseText) {
      const status = lastError?.status && lastError.status >= 400 && lastError.status < 600 ? lastError.status : 500;
      return res.status(status).json({
        error: lastError?.message || 'Connection to neural link failed.',
        code: lastError?.code
      });
    }

    return res.json({ text: responseText });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    const parsed = parseGeminiError(error);
    return res.status(parsed.status).json({ error: parsed.message, code: parsed.code });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.use((req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
