import fs from 'fs';
import path from 'path';

// Markdown parser helper for serverless environment
function parseMarkdownContent(filename: string, rawText: string) {
  const slug = filename.replace(/\.md$/, '').replace(/.*[\/\\]/, '');
  let title = slug.charAt(0).toUpperCase() + slug.slice(1);
  let date = new Date().toISOString().split('T')[0];
  let author = 'Moniruzzaman Rishad';
  let summary = 'Tech article and thoughts on AI, engineering, and software architecture.';
  let tags: string[] = ['Tech', 'Article'];
  let readTime = '3 min read';
  let image: string | undefined;
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
        else if (key === 'image' || key === 'cover' || key === 'coverimage') image = value;
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
    image,
    content
  };
}

export const handler = async (event: any) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Try multiple possible paths for the blogs directory in Netlify Lambda
    const possibleDirs = [
      path.join(process.cwd(), 'blogs'),
      path.join(__dirname, '../../blogs'),
      path.join(__dirname, '../blogs'),
      path.join(__dirname, 'blogs')
    ];

    let blogsDir = '';
    for (const dir of possibleDirs) {
      if (fs.existsSync(dir)) {
        blogsDir = dir;
        break;
      }
    }

    if (blogsDir) {
      const files = fs.readdirSync(blogsDir).filter(f => f.endsWith('.md'));
      const blogs = files.map(file => {
        const raw = fs.readFileSync(path.join(blogsDir, file), 'utf-8');
        return parseMarkdownContent(file, raw);
      });

      blogs.sort((a, b) => {
        const matchA = a.id.match(/^blog(\d+)$/i);
        const matchB = b.id.match(/^blog(\d+)$/i);
        if (matchA && matchB) return parseInt(matchA[1], 10) - parseInt(matchB[1], 10);
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(blogs)
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify([])
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error?.message || 'Failed to fetch blogs' })
    };
  }
};
