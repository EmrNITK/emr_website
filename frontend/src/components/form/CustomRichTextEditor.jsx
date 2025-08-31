import React from 'react';
import MDEditor from "@uiw/react-md-editor";

const CustomRichTextEditor = ({ 
  value = "", 
  onChange, 
  placeholder = "Describe your event...",
  height = "600px"
}) => {
  const handleChange = (val) => {
    onChange(val || '');
  };

  return (
    <div className="space-y-3">
      {/* Editor Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-secondary">
          <span className={`${value.length >= 100 && value.length <= 2000 ? 'text-green-400' : 'text-gray-400'}`}>
            {value.length} characters
          </span>
          <span className="text-gray-400">
            {value.split(/\s+/).filter(word => word.length > 0).length} words
          </span>
        </div>
      </div>

      {/* Editor */}
      <div className="bg-white/5 rounded-lg overflow-hidden border border-white/10">
        <MDEditor
          value={value}
          onChange={handleChange}
          height={height}
          preview="edit"
          highlightEnable={false}
          style={{
            backgroundColor: "transparent",
            color: "white",
          }}
        />
      </div>
    </div>
  );
};

export default CustomRichTextEditor;
