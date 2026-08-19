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

/**
 * Loads blogs using Vite's import.meta.glob to read all .md files inside /blogs folder
 */
export function getLocalBlogs(): BlogPost[] {
  try {
    const glob = import.meta.glob('/blogs/*.md', { query: '?raw', eager: true }) as Record<string, { default?: string } | string>;
    const blogs: BlogPost[] = [];

    for (const path in glob) {
      const module = glob[path];
      const rawText = typeof module === 'string' ? module : (module?.default || '');
      const filename = path.split('/').pop() || path;
      if (rawText) {
        blogs.push(parseMarkdownBlog(filename, rawText));
      }
    }

    // Sort blogs by date descending or by blog number (blog1, blog2, blog3)
    return blogs.sort((a, b) => {
      // Natural sorting for blog1, blog2, blog10
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
 * Fetch blogs from server API or fallback to local Vite glob
 */
export async function fetchAllBlogs(): Promise<BlogPost[]> {
  try {
    const res = await fetch('/api/blogs');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (e) {
    console.log('Fetching /api/blogs failed, using local glob fallback');
  }
  return getLocalBlogs();
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
