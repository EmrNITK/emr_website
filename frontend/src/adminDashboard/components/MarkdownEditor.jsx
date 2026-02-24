import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bold, Italic, Link as LinkIcon, List, ListOrdered, Image as ImageIcon, X, Check, Unlink } from 'lucide-react';
import { marked } from 'marked';
import TurndownService from 'turndown';
import ImageUploader from './ImageUploader';

// --- PREPROCESSOR ---
const preprocessMarkdown = (md) => {
  if (!md) return "";
  return md.replace(/!\[([^\]]*)\]\(([^)]+)\)\{([^}]+)\}/g, (match, alt, src, widthAttr) => {
    let w = widthAttr.replace('width=', '').trim();
    if (!w.endsWith('%') && !w.endsWith('px') && !w.endsWith('vw')) w += '%';
    return `<img src="${src}" alt="${alt}" style="width: ${w}; max-width: 100%;" />`;
  });
};

// --- TURNDOWN CONFIGURATION ---
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

turndownService.addRule('resizableImage', {
  filter: 'img',
  replacement: function (content, node) {
    const src = node.getAttribute('src') || '';
    const alt = node.getAttribute('alt') || '';
    const width = node.style.width || node.getAttribute('width');
    
    if (width) {
      return `![${alt}](${src}){width=${width}}`;
    }
    return `![${alt}](${src})`;
  }
});

const RichMarkdownEditor = ({ initialValue = "", onChange }) => {
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const linkInputRef = useRef(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [savedRange, setSavedRange] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const [imgRect, setImgRect] = useState(null);
  const [linkState, setLinkState] = useState({ isOpen: false, url: '', targetNode: null });
  const [activeFormats, setActiveFormats] = useState({ 
    bold: false, italic: false, insertUnorderedList: false, insertOrderedList: false, link: false 
  });

  useEffect(() => {
    if (editorRef.current && initialValue && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = marked.parse(preprocessMarkdown(initialValue));
    }
  }, [initialValue]);

  const syncImgRect = useCallback(() => {
    if (selectedImg && editorRef.current) {
      const edRect = editorRef.current.getBoundingClientRect();
      const imgR = selectedImg.getBoundingClientRect();
      setImgRect({
        top: imgR.top - edRect.top + editorRef.current.scrollTop,
        left: imgR.left - edRect.left + editorRef.current.scrollLeft,
        width: imgR.width,
        height: imgR.height
      });
    } else {
      setImgRect(null);
    }
  }, [selectedImg]);

  useEffect(() => {
    syncImgRect();
    window.addEventListener('resize', syncImgRect);
    return () => window.removeEventListener('resize', syncImgRect);
  }, [syncImgRect]);

  const handleInput = useCallback(() => {
    if (editorRef.current && onChange) {
      syncImgRect(); 
      const html = editorRef.current.innerHTML;
      const markdown = turndownService.turndown(html);
      onChange(markdown);
    }
  }, [onChange, syncImgRect]);

  const handleContainerFocus = () => setIsEditing(true);
  
  const handleContainerBlur = (e) => {
    if (showUploader) return;
    if (containerRef.current && !containerRef.current.contains(e.relatedTarget)) {
      setIsEditing(false);
      setSelectedImg(null);
      setShowUploader(false);
      setLinkState({ isOpen: false, url: '', targetNode: null });
    }
  };

  const updateActiveStates = useCallback((e) => {
    if (e && e.target && e.target.tagName === 'IMG') {
      setSelectedImg(e.target);
    } else if (e && e.type === 'mouseup') {
      setSelectedImg(null); 
    }

    const formats = ['bold', 'italic', 'insertUnorderedList', 'insertOrderedList'];
    const newStates = {};
    formats.forEach(cmd => newStates[cmd] = document.queryCommandState(cmd));

    const selection = window.getSelection();
    let isLink = false;
    if (selection.rangeCount > 0) {
      let node = selection.focusNode;
      while (node && node !== editorRef.current) {
        if (node.nodeName === 'A') isLink = true;
        node = node.parentNode;
      }
    }
    newStates.link = isLink;
    setActiveFormats(newStates);
  }, []);

  const handleKeyDown = (e) => {
    if (selectedImg && (e.key === 'Backspace' || e.key === 'Delete')) {
      e.preventDefault();
      selectedImg.remove();
      setSelectedImg(null);
      setImgRect(null);
      handleInput(); 
    }
  };

  const executeCommand = (command, value = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
      updateActiveStates();
      handleInput();
    }
  };

  const executeFormatCommand = (command) => executeCommand(command);

  const openLinkEditor = (e) => {
    e.preventDefault();
    const selection = window.getSelection();
    if (selection.rangeCount > 0) setSavedRange(selection.getRangeAt(0));

    let node = selection.focusNode;
    let existingLinkNode = null;
    while (node && node !== editorRef.current) {
      if (node.nodeName === 'A') { existingLinkNode = node; break; }
      node = node.parentNode;
    }

    setLinkState({
      isOpen: true,
      url: existingLinkNode ? existingLinkNode.getAttribute('href') : '',
      targetNode: existingLinkNode
    });
    setTimeout(() => linkInputRef.current?.focus(), 0);
  };

  const saveLink = () => {
    if (editorRef.current) {
      editorRef.current.focus();
      if (savedRange && !linkState.targetNode) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(savedRange);
      }
      if (linkState.url) {
        if (linkState.targetNode) {
          linkState.targetNode.setAttribute('href', linkState.url);
        } else {
          executeCommand('createLink', linkState.url);
        }
        handleInput();
      }
    }
    setLinkState({ isOpen: false, url: '', targetNode: null });
    setSavedRange(null);
  };

  const removeLink = () => {
    if (linkState.targetNode) {
      const text = document.createTextNode(linkState.targetNode.textContent);
      linkState.targetNode.parentNode.replaceChild(text, linkState.targetNode);
      handleInput();
    }
    setLinkState({ isOpen: false, url: '', targetNode: null });
  };

  const handleImageUploaded = (url) => {
    if (editorRef.current) {
      editorRef.current.focus();
      if (savedRange) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(savedRange);
      }
      executeCommand('insertHTML', `&nbsp;<img src="${url}" alt="Image" style="width: 50%; max-width: 100%;" />&nbsp;`);
    }
    setShowUploader(false);
    setSavedRange(null);
  };

  const startImageResize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedImg || !editorRef.current) return;

    const startX = e.clientX;
    const startWidthPx = selectedImg.getBoundingClientRect().width;
    const containerWidth = editorRef.current.getBoundingClientRect().width;

    const onMouseMove = (moveEvent) => {
      const newWidthPx = Math.max(50, startWidthPx + (moveEvent.clientX - startX)); 
      const newWidthPct = Math.min(100, (newWidthPx / containerWidth) * 100);
      
      selectedImg.style.width = `${newWidthPct.toFixed(2)}%`;
      selectedImg.removeAttribute('width'); 
      syncImgRect(); 
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      handleInput(); 
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const ToolbarButton = ({ onClick, active, icon: Icon, title }) => (
    <button
      onMouseDown={onClick}
      className={`p-2 rounded transition-colors ${
        active ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
      }`}
      title={title}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <div 
      ref={containerRef}
      onFocus={handleContainerFocus}
      onBlur={handleContainerBlur}
      tabIndex={-1} 
      className={`flex flex-col w-full max-w-3xl bg-zinc-950/40 rounded-xl overflow-hidden transition-all duration-300 outline-none
        ${isEditing ? 'border border-zinc-700 shadow-xl' : 'border border-transparent'}
      `}
    >
      {isEditing && (
        <div className="flex items-center gap-1 p-2 bg-zinc-900 border-b border-zinc-800 flex-wrap relative">
          <ToolbarButton onClick={(e) => { e.preventDefault(); executeFormatCommand('bold'); }} active={activeFormats.bold} icon={Bold} title="Bold" />
          <ToolbarButton onClick={(e) => { e.preventDefault(); executeFormatCommand('italic'); }} active={activeFormats.italic} icon={Italic} title="Italic" />
          <ToolbarButton onClick={openLinkEditor} active={activeFormats.link || linkState.isOpen} icon={LinkIcon} title="Link" />
          <div className="w-px h-5 bg-zinc-700 mx-2"></div>
          <ToolbarButton onClick={(e) => { e.preventDefault(); executeCommand('insertUnorderedList'); }} active={activeFormats.insertUnorderedList} icon={List} title="Bullet List" />
          <ToolbarButton onClick={(e) => { e.preventDefault(); executeCommand('insertOrderedList'); }} active={activeFormats.insertOrderedList} icon={ListOrdered} title="Numbered List" />
          <div className="w-px h-5 bg-zinc-700 mx-2"></div>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              const selection = window.getSelection();
              if (selection.rangeCount > 0) setSavedRange(selection.getRangeAt(0));
              setShowUploader(!showUploader);
            }}
            className={`p-2 rounded transition-colors flex items-center gap-2 text-sm font-medium ml-auto ${
              showUploader ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Image</span>
          </button>
        </div>
      )}

      {/* RESTORED LINK EDITOR UI */}
      {isEditing && linkState.isOpen && (
        <div className="px-4 py-3 bg-zinc-800 border-b border-zinc-700 flex items-center gap-2">
          <input
            ref={linkInputRef}
            type="url"
            value={linkState.url}
            onChange={(e) => setLinkState({ ...linkState, url: e.target.value })}
            placeholder="https://example.com"
            className="flex-1 bg-zinc-900 border border-zinc-700 text-zinc-100 px-3 py-1.5 rounded text-sm focus:outline-none focus:border-blue-500"
            onKeyDown={(e) => e.key === 'Enter' && saveLink()}
          />
          <button onMouseDown={(e) => { e.preventDefault(); saveLink(); }} className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded">
            <Check className="w-4 h-4" />
          </button>
          {linkState.targetNode && (
            <button onMouseDown={(e) => { e.preventDefault(); removeLink(); }} className="p-1.5 bg-red-500/10 text-red-400 rounded">
              <Unlink className="w-4 h-4" />
            </button>
          )}
          <button onMouseDown={(e) => { e.preventDefault(); setLinkState({ isOpen: false, url: '', targetNode: null }); }} className="p-1.5 text-zinc-400 hover:text-zinc-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* RESTORED IMAGE UPLOADER UI */}
      {isEditing && showUploader && (
        <div className="p-4 bg-zinc-900 border-b border-zinc-800 relative">
          <button onMouseDown={() => setShowUploader(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 z-10"><X className="w-5 h-5" /></button>
          <ImageUploader onUpload={handleImageUploaded} width={800} />
        </div>
      )}

      <div className="relative w-full">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onKeyUp={updateActiveStates}
          onMouseUp={updateActiveStates}
          onKeyDown={handleKeyDown} 
          className={`w-full min-h-[4rem] p-4 bg-transparent text-zinc-100 focus:outline-none leading-relaxed
            ${!isEditing ? 'hover:bg-zinc-900/50 rounded-xl transition-colors cursor-text' : ''}
            [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-2
            [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-2
            [&_a]:text-blue-400 [&_a]:underline
            [&_img]:inline-block [&_img]:align-bottom [&_img]:mx-1 [&_img]:rounded-md [&_img]:cursor-pointer
          `}
        />

        {isEditing && selectedImg && imgRect && (
          <div
            style={{
              position: 'absolute',
              top: imgRect.top,
              left: imgRect.left,
              width: imgRect.width,
              height: imgRect.height,
              border: '2px solid #3b82f6',
              pointerEvents: 'none',
              zIndex: 10
            }}
          >
            <div
              style={{
                position: 'absolute',
                bottom: -6,
                right: -6,
                width: 14,
                height: 14,
                backgroundColor: '#3b82f6',
                border: '2px solid white',
                borderRadius: '50%',
                cursor: 'nwse-resize',
                pointerEvents: 'auto'
              }}
              onMouseDown={startImageResize}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RichMarkdownEditor;