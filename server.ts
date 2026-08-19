import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import { ABOUT_TEXT, EXPERIENCE, PROJECTS, SKILLS } from './constants.js';

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

const app = express();
const PORT = 3000;

app.use(express.json());

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

// API route for Gemini chat
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY or VITE_API_KEY environment variable is missing.'
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

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    if (!response.text) {
      return res.status(500).json({ error: 'The model returned an empty response.' });
    }

    return res.json({ text: response.text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: error.message || 'Connection to neural link failed.' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
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
