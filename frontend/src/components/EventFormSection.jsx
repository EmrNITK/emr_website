import React, { useState, useContext } from "react";
import Accordion from "./Accordion";
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
    <>
      <Accordion title={title}>
        {fields.map((field, index) => {
          return (
            <Input
              key={`${field.name}-${index}`}
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
          );
        })}

        <button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className={`${
            isEditing
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-red-500 hover:bg-red-600"
          } text-white font-semibold px-4 py-2 rounded-md self-end mt-2`}
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </Accordion>
    </>
  );
};
