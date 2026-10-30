import { BlogPost } from '../types';

/**
 * Parses markdown frontmatter and content
 */
export function parseMarkdownBlog(filename: string, rawText: string): BlogPost {
  const slug = filename.replace(/\.md$/, '').replace(/.*[\/\\]/, '');
  
  let title = slug.charAt(0).toUpperCase() + slug.slice(1);
  let date = new Date().toISOString().split('T')[0];
  let author = 'Moniruzzaman Rishad';
  let summary = 'Tech article and thoughts on AI, engineering, and software architecture.';
  let tags: string[] = ['Tech', 'Article'];
  let readTime = '3 min read';
  let content = rawText;

  // Check for YAML Frontmatter delimited by ---
  const frontmatterMatch = rawText.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);

  if (frontmatterMatch) {
    const yamlHeader = frontmatterMatch[1];
    content = frontmatterMatch[2].trim();

    yamlHeader.split('\n').forEach(line => {
      const colonIdx = line.indexOf(':');
      if (colonIdx !== -1) {
        const key = line.slice(0, colonIdx).trim().toLowerCase();
        let value = line.slice(colonIdx + 1).trim();

        // Remove surrounding quotes if present
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
            if (value.startsWith('[')) {
              tags = JSON.parse(value);
            } else {
              tags = value.split(',').map(t => t.trim().replace(/['"\[\]]/g, ''));
            }
          } catch {
            tags = value.split(',').map(t => t.trim());
          }
        }
      }
    });
  } else {
    // Extract first H1 heading as title if available
    const h1Match = rawText.match(/^#\s+(.+)$/m);
    if (h1Match) {
      title = h1Match[1].trim();
    }
  }

  // Estimate read time if not provided in header
  if (!readTime || readTime === '3 min read') {
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    readTime = `${minutes} min read`;
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

// Vite static glob macro to bundle all markdown files from the blogs directory at build time
// IMPORTANT: import.meta.glob MUST be called literally so Vite's compiler macro transforms it
const rawBlogModules = import.meta.glob<string | { default?: string }>('../blogs/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

/**
 * Loads blogs using Vite's static import.meta.glob to read all .md files inside /blogs folder.
 * This works seamlessly on both local development and static hosting platforms (Netlify, Vercel, GitHub Pages).
 */
export function getLocalBlogs(): BlogPost[] {
  try {
    const blogs: BlogPost[] = [];

    for (const path in rawBlogModules) {
      const module = rawBlogModules[path];
      const rawText = typeof module === 'string' ? module : (module?.default || '');
      const filename = path.split('/').pop() || path;
      if (rawText && rawText.trim().length > 0) {
        blogs.push(parseMarkdownBlog(filename, rawText));
      }
    }

    // Sort blogs by natural number order (blog1, blog2, blog3) or date descending
    return blogs.sort((a, b) => {
      const numA = parseInt(a.id.replace(/\D/g, ''), 10);
      const numB = parseInt(b.id.replace(/\D/g, ''), 10);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch (err) {
    console.warn('Failed to load local blogs via glob:', err);
    return [];
  }
}

/**
 * Fetch blogs: returns locally bundled blogs immediately (guaranteed on Netlify/Vite),
 * or falls back to /api/blogs if running in an environment without bundled modules.
 */
export async function fetchAllBlogs(): Promise<BlogPost[]> {
  // Check local bundled blogs first (instant, works offline and on Netlify static hosting)
  const localBlogs = getLocalBlogs();
  if (localBlogs.length > 0) {
    return localBlogs;
  }

  // Fallback: try querying /api/blogs if local glob was empty
  try {
    const res = await fetch('/api/blogs');
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (e) {
    console.warn('Fetching /api/blogs fallback failed:', e);
  }

  return localBlogs;
}

/**
 * Finds a specific blog by slug, filename, or number (e.g. "1", "blog1", "blog1.md")
 */
export function findBlog(blogs: BlogPost[], query: string): BlogPost | undefined {
  if (!query) return undefined;
  const q = query.trim().toLowerCase();
  
  // Try exact match
  let found = blogs.find(b => b.id.toLowerCase() === q || b.filename.toLowerCase() === q);
  if (found) return found;

  // Try matching numeric index (e.g., "1" -> "blog1")
  if (/^\d+$/.test(q)) {
    const num = parseInt(q, 10);
    found = blogs.find(b => b.id.toLowerCase() === `blog${num}` || b.filename.toLowerCase() === `blog${num}.md`);
    if (found) return found;
    if (blogs[num - 1]) return blogs[num - 1];
  }

  // Try partial title/id search
  return blogs.find(b => b.title.toLowerCase().includes(q) || b.id.toLowerCase().includes(q));
}
