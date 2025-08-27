import React, { useContext, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { EventFormContext } from "../context/EventFormContext";

export const EventDescriptionSection = ({ disabled }) => {
  const [isEditing, setIsEditing] = useState(!disabled);
  const { eventData, updateField } = useContext(EventFormContext);
  const [content, setContent] = useState(eventData["description"] || "");

  const handleSave = () => {
    updateField("description", content);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="w-full">
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-semibold text-white mb-2">Event Description</h3>
          <p className="text-secondary text-sm">
            Create a compelling description for your event using markdown formatting
          </p>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {isEditing ? (
            <div className="space-y-4">
              {/* Editor Container */}
              <div className="bg-white/5 rounded-lg overflow-hidden border border-white/10">
                <MDEditor
                  value={content}
                  onChange={setContent}
                  highlightEnable={false}
                  preview="edit"
                  height="400px"
                  style={{
                    backgroundColor: "transparent",
                    color: "white",
                  }}
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setContent(eventData["description"] || "");
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105"
                >
                  Save Description
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Preview Container */}
              <div className="bg-white/5 rounded-lg p-6 border border-white/10 min-h-[400px]">
                {content ? (
                  <MDEditor.Markdown
                    source={content}
                    style={{ 
                      backgroundColor: "transparent",
                      color: "white",
                    }}
                    className="prose prose-invert max-w-none"
                  />
                ) : (
                  <div className="text-center text-secondary py-16 flex flex-col items-center justify-center">
                    <div className="text-4xl mb-3">📝</div>
                    <p className="text-lg font-medium mb-1">No description added yet</p>
                    <p className="text-sm opacity-75">Click edit to add your event description</p>
                  </div>
                )}
              </div>
              
              {/* Action Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105"
                >
                  {content ? "Edit Description" : "Add Description"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Markdown Tips */}
        <div className="p-4 bg-blue-500/5 border-t border-white/10">
          <h4 className="text-white font-medium mb-2 text-sm">💡 Markdown Tips:</h4>
          <div className="text-secondary text-xs space-y-1">
            <p>• Use <code className="bg-white/10 px-1 rounded text-xs"># Heading</code> for titles</p>
            <p>• Use <code className="bg-white/10 px-1 rounded text-xs">**bold**</code> or <code className="bg-white/10 px-1 rounded text-xs">*italic*</code> for emphasis</p>
            <p>• Use <code className="bg-white/10 px-1 rounded text-xs">- item</code> for bullet points</p>
            <p>• Use <code className="bg-white/10 px-1 rounded text-xs">[text](url)</code> for links</p>
          </div>
        </div>
      </div>
    </div>
  );
};
