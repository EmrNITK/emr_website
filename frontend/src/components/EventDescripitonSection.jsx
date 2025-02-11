import React, { useContext, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import Accordion from "./Accordion";
import useUpdateEffect from "../hooks/useUpdateEffect";
import { EventFormContext } from "../context/EventFormContext";

export const EventDescriptionSection = ({ disabled }) => {
  const [isEditing, setIsEditing] = useState(!disabled);
  const { eventData, updateField } = useContext(EventFormContext);
  const [content, setContent] = useState(eventData["description"]);

  useUpdateEffect(() => {
    updateField("description", content);
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing();
  };

  return (
    <>
      <Accordion title={"Description"}>
        {isEditing ? (
          <MDEditor
            value={content}
            onChange={setContent}
            highlightEnable={false}
          />
        ) : (
          <MDEditor.Markdown
            source={content}
            style={{ backgroundColor: "transparent" }}
            className="mt-4 p-4 bg-transparent rounded-md"
          />
        )}
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
