import React, { useState } from "react";
import { DynamicList } from "./DynamicList";

export const EventDynamicListSection = ({
  title,
  section,
  fields,
  disabled,
}) => {
  const [isEditing, setIsEditing] = useState(!disabled);

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="w-full transition-all duration-300 ease-in-out">
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
          <p className="text-secondary">
            Manage your event's {title.toLowerCase()}. Add, edit, or remove items as needed.
          </p>
        </div>

        <div className="space-y-4">
          <DynamicList section={section} fields={fields} isEditing={isEditing} />

          <div className="flex justify-end pt-4">
            <button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 ${
                isEditing
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isEditing ? "Save Changes" : "Edit Section"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
