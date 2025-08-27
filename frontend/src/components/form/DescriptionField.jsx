import React, { useState, useEffect, useCallback } from "react";

const DescriptionField = ({ 
  value = "", 
  onChange, 
  placeholder = "Describe your event...",
  storageKey = "event-description-draft",
  enablePreview = true 
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [showPreview, setShowPreview] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved && !value) {
      setLocalValue(saved);
      onChange?.(saved);
    }
  }, [storageKey, value, onChange]);

  // Debounced autosave
  const saveToStorage = useCallback(
    (() => {
      let timeoutId;
      return (text) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          localStorage.setItem(storageKey, text);
          setLastSaved(new Date());
          setIsSaving(false);
        }, 1000);
        setIsSaving(true);
      };
    })(),
    [storageKey]
  );

  // Handle text changes
  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange?.(newValue);
    saveToStorage(newValue);
  };

  const characterCount = localValue.length;
  const isGoodLength = characterCount >= 100 && characterCount <= 1000;

  return (
    <div className="space-y-4">
             {/* Toolbar */}
       <div className="flex items-center justify-between">
         <div className="flex items-center gap-4 text-sm text-secondary">
           <span className={`${isGoodLength ? 'text-green-400' : 'text-gray-400'}`}>
             {characterCount} characters
           </span>
           {lastSaved && (
             <span className="text-xs">
               Draft saved {lastSaved.toLocaleTimeString()}
             </span>
           )}
           {isSaving && (
             <span className="text-xs text-blue-400">Saving...</span>
           )}
         </div>
         
         {enablePreview && (
           <button
             type="button"
             onClick={() => setShowPreview(!showPreview)}
             className="px-3 py-1 text-sm text-secondary hover:text-white border border-white/20 rounded-md hover:bg-white/10 transition-colors"
           >
             {showPreview ? 'Edit' : 'Preview'}
           </button>
         )}
       </div>

             {/* Textarea or Preview */}
       {!showPreview ? (
         <textarea
           value={localValue}
           onChange={handleChange}
           placeholder={placeholder}
           className="w-full min-h-[12rem] md:min-h-[18rem] p-4 border border-white/20 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 bg-white/5 leading-relaxed"
           style={{ lineHeight: '1.6' }}
         />
       ) : (
         <div className="w-full min-h-[12rem] md:min-h-[18rem] p-4 border border-white/20 rounded-lg bg-white/5 text-white leading-relaxed whitespace-pre-wrap">
           {localValue || (
             <span className="text-gray-400 italic">No content to preview</span>
           )}
         </div>
       )}

       {/* Help text */}
       <p className="text-xs text-gray-400">
         Recommended length: 100-1000 characters. Include event details, requirements, and what participants can expect.
       </p>
    </div>
  );
};

export default DescriptionField;
