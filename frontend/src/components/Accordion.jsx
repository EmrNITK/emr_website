import React, { useState } from "react";

const Accordion = ({ title, children, onSave, isEditing, setIsEditing }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    onSave();
    setIsOpen(false);
    setIsEditing(false);
  };

  return (
    <div className="w-full p-2 bg-gray-800 rounded-xl">
      <div
        className="flex justify-between items-center text-white p-2 rounded-lg cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold">{title}</span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && (
        <div className="p-3 bg-gray-900 rounded-lg mt-2">
          <div className="flex flex-col gap-4">
            {React.Children.map(children, (child) =>
              React.cloneElement(child, { disabled: !isEditing })
            )}
            <button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className={`${
                isEditing ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"
              } text-white font-semibold px-4 py-2 rounded-md self-end mt-2`}
            >
              {isEditing ? "Save" : "Edit"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accordion;