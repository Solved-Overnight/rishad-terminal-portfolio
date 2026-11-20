import React from 'react';

/**
 * Utility to format and colorize keywords, status codes, paths, URLs, and code blocks
 * in terminal output string for an authentic and high-readability CLI experience.
 */

interface ColorizeOptions {
  className?: string;
  preserveWhitespace?: boolean;
}

export function colorizeTerminalText(
  text: string, 
  options: ColorizeOptions = {}
): React.ReactNode {
  if (!text) return text;

  // Split text into tokens using Regex matching:
  // 1. URLs: https://... or http://...
  // 2. Bracket tags: [SUCCESS], [ERROR], [WARN], [INFO], [200 OK], [SYSTEM], etc.
  // 3. Backtick code blocks: `code`
  // 4. File paths / Filenames: /path/to/file or file.ext
  // 5. Explicit keywords (case-insensitive boundary checks)
  // 6. Command flags: --flag or -f

  const pattern = new RegExp(
    [
      // 1. URLs
      `(https?:\\/\\/[^\\s\\)]+|mailto:[^\\s\\)]+)`,
      // 2. Bracket tags e.g. [SUCCESS], [ERROR], [v1.0.0], [200]
      `(\\[[A-Za-z0-9_\\-\\.\t ]+\\])`,
      // 3. Inline code in backticks `...`
      `(\`[^\`]+\`)`,
      // 4. File paths & filenames with common extensions
      `((?:\\/|~\\/|\\.\\/)[a-zA-Z0-9_\\-\\.\\/]+|[a-zA-Z0-9_\\-]+\\.(?:ts|tsx|js|jsx|json|md|py|sh|css|html|png|jpg|svg|txt|conf|yaml|yml))`,
      // 5. Command line options / flags
      `((?:^|\\s)(?:--[a-zA-Z0-9\\-]+|-[a-zA-Z0-9]+))`,
      // 6. Keywords
      `\\b(SUCCESS|SUCCESSFUL|SUCCESSFULLY|ENABLED|ONLINE|CONNECTED|PASSED|COMPLETED|DONE|OK|200 OK|ERROR|FAILED|FAILURE|CRITICAL|DISABLED|OFFLINE|DENIED|PERMISSION DENIED|NOT FOUND|COMMAND NOT FOUND|WARNING|WARN|CAUTION|PENDING|DEPRECATED|INFO|NOTICE|SYSTEM|NOTE)\\b`
    ].join('|'),
    'gi'
  );

  const parts = text.split(pattern);

  const renderedParts = parts.map((part, index) => {
    if (!part) return null;

    // 1. Backtick code block
    if (part.startsWith('`') && part.endsWith('`') && part.length > 1) {
      const codeContent = part.slice(1, -1);
      return (
        <code 
          key={index} 
          className="text-amber-200 font-mono bg-black/40 px-1.5 py-0.5 rounded border border-amber-500/30 text-xs sm:text-sm inline-block my-0.5"
        >
          {codeContent}
        </code>
      );
    }

    // 2. Bracket Tag Parsing
    if (part.startsWith('[') && part.endsWith(']') && part.length > 2) {
      const upper = part.toUpperCase();
      if (upper.includes('SUCCESS') || upper.includes('OK') || upper.includes('DONE') || upper.includes('PASSED') || upper.includes('200') || upper.includes('ONLINE')) {
        return (
          <span key={index} className="inline-block px-1.5 py-0.5 mx-0.5 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            {part}
          </span>
        );
      }
      if (upper.includes('ERR') || upper.includes('FAIL') || upper.includes('CRITICAL') || upper.includes('DENIED') || upper.includes('404') || upper.includes('500') || upper.includes('MUTED')) {
        return (
          <span key={index} className="inline-block px-1.5 py-0.5 mx-0.5 rounded bg-rose-500/15 border border-rose-500/40 text-rose-400 font-bold text-xs uppercase tracking-wider">
            {part}
          </span>
        );
      }
      if (upper.includes('WARN') || upper.includes('CAUTION') || upper.includes('PENDING') || upper.includes('401')) {
        return (
          <span key={index} className="inline-block px-1.5 py-0.5 mx-0.5 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold text-xs uppercase tracking-wider">
            {part}
          </span>
        );
      }
      // Default info tag
      return (
        <span key={index} className="inline-block px-1.5 py-0.5 mx-0.5 rounded bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-semibold text-xs tracking-wider">
          {part}
        </span>
      );
    }

    // 3. URLs
    if (part.match(/^(https?:\/\/[^\s\)]+|mailto:[^\s\)]+)$/i)) {
      return (
        <a 
          key={index} 
          href={part} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-cyan-300 underline underline-offset-2 hover:text-cyan-100 transition-colors font-medium"
        >
          {part}
        </a>
      );
    }

    // 4. File Paths / Filenames
    if (part.match(/^(?:\/|~\/|\.\/)[a-zA-Z0-9_\-\.\/]+$/) || part.match(/^[a-zA-Z0-9_\-]+\.(?:ts|tsx|js|jsx|json|md|py|sh|css|html|png|jpg|svg|txt|conf|yaml|yml)$/i)) {
      return (
        <span key={index} className="text-purple-300 font-mono underline decoration-purple-500/30">
          {part}
        </span>
      );
    }

    // 5. Command options (--flag or -f)
    if (part.match(/^(?:^|\s)(?:--[a-zA-Z0-9\-]+|-[a-zA-Z0-9]+)$/)) {
      return (
        <span key={index} className="text-cyan-200 font-mono font-semibold">
          {part}
        </span>
      );
    }

    // 6. Word-based Keyword Highlights
    const upperPart = part.toUpperCase().trim();
    
    // Success keywords
    if (['SUCCESS', 'SUCCESSFUL', 'SUCCESSFULLY', 'ENABLED', 'ONLINE', 'CONNECTED', 'PASSED', 'COMPLETED', 'DONE', 'OK', '200 OK'].includes(upperPart)) {
      return (
        <span key={index} className="text-emerald-400 font-bold">
          {part}
        </span>
      );
    }

    // Error keywords
    if (['ERROR', 'FAILED', 'FAILURE', 'CRITICAL', 'DISABLED', 'OFFLINE', 'DENIED', 'PERMISSION DENIED', 'NOT FOUND', 'COMMAND NOT FOUND'].includes(upperPart)) {
      return (
        <span key={index} className="text-rose-400 font-bold">
          {part}
        </span>
      );
    }

    // Warning keywords
    if (['WARNING', 'WARN', 'CAUTION', 'PENDING', 'DEPRECATED'].includes(upperPart)) {
      return (
        <span key={index} className="text-amber-300 font-bold">
          {part}
        </span>
      );
    }

    // Info keywords
    if (['INFO', 'NOTICE', 'SYSTEM', 'NOTE'].includes(upperPart)) {
      return (
        <span key={index} className="text-cyan-300 font-semibold">
          {part}
        </span>
      );
    }

    // Plain text segment
    return part;
  });

  const whitespaceClass = options.preserveWhitespace !== false ? 'whitespace-pre-wrap break-words' : '';

  return (
    <span className={`${whitespaceClass} ${options.className || ''}`.trim()}>
      {renderedParts}
    </span>
  );
}

/**
 * Component version for direct JSX rendering
 */
export const ColorizedOutput: React.FC<{
  text: string;
  className?: string;
  preserveWhitespace?: boolean;
}> = ({ text, className, preserveWhitespace = true }) => {
  return <>{colorizeTerminalText(text, { className, preserveWhitespace })}</>;
};
