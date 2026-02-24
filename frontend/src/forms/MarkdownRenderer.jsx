import React from 'react';
import { marked } from 'marked';

// --- PREPROCESSOR ---
const preprocessMarkdown = (md) => {
  if (!md) return "";
  return md.replace(/!\[([^\]]*)\]\(([^)]+)\)\{([^}]+)\}/g, (match, alt, src, widthAttr) => {
    let w = widthAttr.replace('width=', '').trim();
    if (!w.endsWith('%') && !w.endsWith('px') && !w.endsWith('vw')) w += '%';
    return `<img src="${src}" alt="${alt}" style="width: ${w}; max-width: 100%;" />`;
  });
};

export default function MarkdownRenderer({ content, className = "" }) {
  if (!content) return null;

  const processedContent = preprocessMarkdown(content);
  
  // Parse to HTML and force all links to open in a new blank tab
  let rawHtml = marked.parse(processedContent);
  rawHtml = rawHtml.replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');

  return (
    <div 
      className={`
        prose prose-invert max-w-none 
        
        /* --- Base Typography --- */
        [&>p]:m-0 [&>p]:mb-1.5
        [&_strong]:text-white [&_strong]:font-bold
        
        /* --- Images --- */
        [&_img]:max-w-full [&_img]:rounded-md [&_img]:shadow-2xl [&_img]:border-zinc-800/50
        
        /* --- Links --- */
        [&_a]:text-blue-400 hover:[&_a]:text-blue-300 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:decoration-blue-400 [&_a]:transition-all
        
        /* --- Code & Preformatted Text --- */
        [&_code]:bg-zinc-800/80 [&_code]:text-blue-300 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:font-mono [&_code]:text-sm [&_code]:border [&_code]:border-zinc-700
        [&_pre]:bg-[#09090b] [&_pre]:border [&_pre]:border-zinc-800/80 [&_pre]:rounded-xl [&_pre]:p-5 [&_pre]:shadow-2xl
        [&_pre>code]:bg-transparent [&_pre>code]:text-zinc-300 [&_pre>code]:p-0 [&_pre>code]:border-none [&_pre>code]:text-sm
        
        /* --- Blockquotes --- */
        [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:bg-gradient-to-r [&_blockquote]:from-blue-500/10 [&_blockquote]:to-transparent [&_blockquote]:py-3 [&_blockquote]:pl-5 [&_blockquote]:pr-4 [&_blockquote]:rounded-r-xl [&_blockquote]:not-italic [&_blockquote]:text-zinc-400 [&_blockquote]:my-6
        
        /* --- Lists --- */
        [&_ul]:list-none [&_ul]:pl-0 [&_ul]:space-y-1 [&_ul]:mb-2
        [&_li]:relative [&_li]:pl-4
        [&_ul>li::before]:content-[''] [&_ul>li::before]:absolute [&_ul>li::before]:w-1.5 [&_ul>li::before]:h-1.5 [&_ul>li::before]:bg-[#51b749] [&_ul>li::before]:rounded-full [&_ul>li::before]:left-1 [&_ul>li::before]:top-2.5
        
        [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-6 [&_ol>li]:pl-2 [&_ol>li::marker]:text-[#51b749] [&_ol>li::marker]:font-bold
        
        /* --- Headings --- */
        [&_h1]:text-white [&_h1]:font-extrabold [&_h1]:tracking-tight [&_h1]:mb-6
        [&_h2]:text-zinc-100 [&_h2]:font-bold [&_h2]:border-b [&_h2]:border-zinc-800/80 [&_h2]:pb-2 [&_h2]:mb-4 [&_h2]:mt-8
        [&_h3]:text-zinc-200 [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3
        
        /* --- Tables --- */
        [&_table]:w-full [&_table]:border-collapse [&_table]:mb-6 [&_table]:overflow-hidden [&_table]:rounded-xl [&_table]:border [&_table]:border-zinc-800
        [&_th]:bg-[#09090b] [&_th]:border-b [&_th]:border-zinc-800 [&_th]:p-4 [&_th]:text-left [&_th]:font-bold [&_th]:text-white
        [&_td]:border-b [&_td]:border-zinc-800/50 [&_td]:p-4 [&_tr:hover]:bg-zinc-800/30 [&_tr]:transition-colors
        
        /* --- Horizontal Rules --- */
        [&_hr]:border-t [&_hr]:border-zinc-800 [&_hr]:my-10
        ${className}
      `}
      dangerouslySetInnerHTML={{ __html: rawHtml }}
    />
  );
}