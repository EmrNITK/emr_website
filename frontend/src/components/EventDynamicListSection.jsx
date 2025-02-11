import React, { useState } from "react";
import Accordion from "./Accordion";
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
    <>
      <Accordion title={title}>
        <DynamicList section={section} fields={fields} isEditing={isEditing} />

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
