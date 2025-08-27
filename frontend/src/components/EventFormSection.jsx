import React, { useState, useContext } from "react";
import { EventFormContext } from "../context/EventFormContext";
import { Input } from "./Input";
import { readFile } from "../utils/readFile";

export const EventFormSection = ({ title, section, fields, disabled }) => {
  const [isEditing, setIsEditing] = useState(!disabled);
  const { eventData, updateField } = useContext(EventFormContext);
  const [sectionData, setSectionData] = useState(eventData);

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e, name) => {
    const updatedInputValues = { ...sectionData };
    updatedInputValues[name] = e.target.value;
    setSectionData(updatedInputValues);
    updateField(name, e.target.value);
  };

  const handleFileChange = (e, name) => {
    const file = e.target.files[0];

    if (!file) return;
    readFile(file, (base64String) => {
      const updatedInputValues = {
        ...sectionData,
        [name]: { name: file.name },
      };
      setSectionData(updatedInputValues);
      console.log(base64String);
      updateField(name, base64String);
    });
  };

  return (
    <div className="w-full">
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
          <p className="text-secondary text-sm">
            Fill in the details for your event's {title.toLowerCase()}
          </p>
        </div>

        {/* Form Fields */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map((field, index) => (
              <div key={`${field.name}-${index}`} className="transition-all duration-200">
                <Input
                  label={field.label}
                  disabled={!isEditing}
                  id={`${field.name}-${index}`}
                  type={field.type}
                  hidden={field.type == "file"}
                  value={field.type == "file" ? "" : sectionData[field.name] ?? ""}
                  fileName={sectionData[field.name]?.name}
                  onChange={(e) => {
                    field.type == "file"
                      ? handleFileChange(e, field.name)
                      : handleInputChange(e, field.name);
                  }}
                />
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-6">
            <button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
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
