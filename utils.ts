import React from 'react';

// Render text with markdown formatting (links, bold, italic) as React elements
export const renderMarkdownLinks = (text: string): (string | React.ReactElement)[] => {
  if (!text) return [''];

  const parts: (string | React.ReactElement)[] = [];
  const markdownRegex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let lastIndex = 0;
  let match;
  let keyCounter = 0;

  while ((match = markdownRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    if (match[1] !== undefined && match[2] !== undefined) {
      parts.push(
        React.createElement('a', {
          key: `link-${keyCounter++}`,
          href: match[2],
          target: '_blank',
          rel: 'noopener noreferrer',
          className: 'text-blue-600 hover:underline break-words'
        }, match[1])
      );
    } else if (match[3] !== undefined) {
      parts.push(
        React.createElement('strong', {
          key: `bold-${keyCounter++}`,
          className: 'font-semibold'
        }, match[3])
      );
    } else if (match[4] !== undefined) {
      parts.push(
        React.createElement('em', {
          key: `italic-${keyCounter++}`
        }, match[4])
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
};
