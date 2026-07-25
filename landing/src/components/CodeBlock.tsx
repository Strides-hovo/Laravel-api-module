import React, { useState } from 'react';

interface CodeBlockProps {
  title?: string;
  code: string;
  language?: string;
  showCopy?: boolean;
  showLineNumbers?: boolean;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  title = 'Terminal',
  code,
  showCopy = true,
  showLineNumbers = false,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split('\n');

  return (
    <div className={`bg-[#0b0f19] rounded-xl border border-[#334155] overflow-hidden shadow-xl ${className}`}>
      {title && (
        <div className="bg-[#161b22] px-4 py-2.5 flex items-center justify-between border-b border-[#334155]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/60"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffb95f]/60"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]/60"></div>
            <span className="font-code text-xs text-[#94a3b8] ml-2">{title}</span>
          </div>

          {showCopy && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-[#94a3b8] hover:text-[#ffb690] transition-colors py-1 px-2 rounded hover:bg-[#222a3d]"
              title="Copy code"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span className="font-code">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          )}
        </div>
      )}

      <div className="p-4 overflow-x-auto font-code text-sm text-[#f8fafc] leading-relaxed">
        {showLineNumbers ? (
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx} className="hover:bg-[#131b2e]/50">
                  <td className="pr-4 select-none text-right text-[#94a3b8]/40 text-xs w-8">
                    {idx + 1}
                  </td>
                  <td className="whitespace-pre">
                    {formatSyntax(line)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <pre className="whitespace-pre overflow-x-auto">
            {lines.map((line, idx) => (
              <div key={idx}>{formatSyntax(line)}</div>
            ))}
          </pre>
        )}
      </div>
    </div>
  );
};

function formatSyntax(line: string) {
  if (line.trim().startsWith('#')) {
    return <span className="text-[#94a3b8] italic">{line}</span>;
  }

  if (line.includes('php artisan') || line.includes('composer')) {
    return (
      <span>
        {line.split(/(php|artisan|composer|vendor:publish|make:api-module|module:make|module:migrate|module:migrate-rollback|module:enable|module:disable|module:optimize|module:delete|module:list)/g).map((part, i) => {
          if (part === 'php' || part === 'composer') return <span key={i} className="text-[#7bd0ff] font-bold">{part}</span>;
          if (part === 'artisan') return <span key={i} className="text-[#ffb690] font-bold">{part}</span>;
          if (part.startsWith('make:') || part.startsWith('vendor:') || part.startsWith('module:')) {
            return <span key={i} className="text-[#ffb690]">{part}</span>;
          }
          if (part.includes('"') || part.includes("'")) {
            return <span key={i} className="text-[#10b981]">{part}</span>;
          }
          return part;
        })}
      </span>
    );
  }

  return renderPhpLine(line);
}

function renderPhpLine(line: string) {
  const TOKEN_REGEX = /(\/\/.+$)|(".*?"|'.*?')|(\$[a-zA-Z_][a-zA-Z0-9_]*)|(\b(?:declare|strict_types|namespace|use|class|extends|public|protected|private|static|function|return|new|array|int|string|bool|void|mixed|true|false|null)\b)|(\b[A-Z][a-zA-Z0-9_\\]*\b)|(\b\d+\b)|(<\?php)/g;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = TOKEN_REGEX.exec(line)) !== null) {
    if (match.index > lastIndex) {
      elements.push(line.substring(lastIndex, match.index));
    }

    const [
      fullMatch,
      comment,
      str,
      variable,
      keyword,
      className,
      number,
      phpTag,
    ] = match;

    const key = match.index;

    if (comment) {
      elements.push(<span key={key} className="text-[#94a3b8] italic">{comment}</span>);
    } else if (str) {
      elements.push(<span key={key} className="text-[#10b981]">{str}</span>);
    } else if (variable) {
      elements.push(<span key={key} className="text-[#7bd0ff]">{variable}</span>);
    } else if (keyword) {
      elements.push(<span key={key} className="text-[#ffb690] font-semibold">{keyword}</span>);
    } else if (className) {
      elements.push(<span key={key} className="text-[#ffb95f]">{className}</span>);
    } else if (number) {
      elements.push(<span key={key} className="text-[#a78bfa]">{number}</span>);
    } else if (phpTag) {
      elements.push(<span key={key} className="text-[#7bd0ff] font-bold">{phpTag}</span>);
    } else {
      elements.push(fullMatch);
    }

    lastIndex = TOKEN_REGEX.lastIndex;
  }

  if (lastIndex < line.length) {
    elements.push(line.substring(lastIndex));
  }

  return <span>{elements}</span>;
}
