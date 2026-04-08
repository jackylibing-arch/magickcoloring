import React from 'react';

// Tiny markdown renderer — handles: # heading, ## heading, lists, tables, links, paragraphs.
// Intentionally minimal to avoid pulling in a markdown dependency.

function renderInline(text: string): React.ReactNode {
  // links [text](url)
  const parts: React.ReactNode[] = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIndex) parts.push(text.slice(lastIndex, m.index));
    if (m[1] && m[2]) {
      parts.push(
        <a key={key++} href={m[2]} className="text-brand-700 underline hover:text-brand-600">
          {m[1]}
        </a>
      );
    } else if (m[3]) {
      parts.push(<strong key={key++}>{m[3]}</strong>);
    } else if (m[4]) {
      parts.push(<em key={key++}>{m[4]}</em>);
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

export function Markdown({ source }: { source: string }) {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    // Heading
    if (line.startsWith('## ')) {
      blocks.push(
        <h2 key={key++} className="text-2xl font-bold mt-10 mb-4">
          {renderInline(line.slice(3))}
        </h2>
      );
      i++;
      continue;
    }
    if (line.startsWith('# ')) {
      blocks.push(
        <h1 key={key++} className="text-3xl font-extrabold mt-10 mb-4">
          {renderInline(line.slice(2))}
        </h1>
      );
      i++;
      continue;
    }

    // Table
    if (line.startsWith('|') && lines[i + 1]?.startsWith('|')) {
      const header = line.split('|').slice(1, -1).map((c) => c.trim());
      i += 2; // skip header + separator
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        rows.push(lines[i].split('|').slice(1, -1).map((c) => c.trim()));
        i++;
      }
      blocks.push(
        <div key={key++} className="my-6 overflow-x-auto">
          <table className="w-full text-left text-sm border border-orange-100">
            <thead className="bg-orange-50">
              <tr>
                {header.map((h, k) => (
                  <th key={k} className="px-3 py-2 font-semibold border-b border-orange-100">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri} className="border-b border-orange-50">
                  {r.map((c, ci) => (
                    <td key={ci} className="px-3 py-2">{renderInline(c)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Unordered list
    if (line.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(lines[i].slice(2));
        i++;
      }
      blocks.push(
        <ul key={key++} className="list-disc pl-6 my-4 space-y-1 text-gray-800">
          {items.map((it, k) => (
            <li key={k}>{renderInline(it)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Paragraph
    blocks.push(
      <p key={key++} className="my-4 text-gray-800 leading-relaxed">
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return <div className="prose-like">{blocks}</div>;
}
