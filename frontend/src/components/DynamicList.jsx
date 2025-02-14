import React, { useContext, useState } from "react";
import { EventFormContext } from "../context/EventFormContext";
import useUpdateEffect from "../hooks/useUpdateEffect";
import { FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import { Input } from "./Input";

export const DynamicList = ({ fields, section, isEditing }) => {
  const { eventData, updateField } = useContext(EventFormContext);
  const [items, setItems] = useState(eventData[section]);
  const [inputValues, setInputValues] = useState(fields.map(() => ""));

  useUpdateEffect(() => {
    console.log("render");
    updateField(section, items);
  }, [isEditing]);

  const handleAdd = () => {
    if (inputValues.every((val) => val.trim())) {
      const newItem = fields.reduce((obj, field, index) => {
        obj[field.name] = inputValues[index];
        return obj;
      }, {});
      setItems([...items, newItem]);
      setInputValues(fields.map(() => ""));
    }
  };
  //   console.log(inputValues);

  const handleDeleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleEditItem = (index) => {
    const updatedItems = [...items];
    updatedItems[index].editing = true; // Add editing state
    setItems(updatedItems);
  };

  const handleSaveEdit = (index) => {
    const updatedItems = [...items];
    delete updatedItems[index].editing; // Remove editing state after saving
    setItems(updatedItems);
  };

  const handleInputChange = (e, index, field) => {
    const updatedItems = [...items];
    updatedItems[index][field] = e.target.value;
    setItems(updatedItems);
  };
  return (
    <>
      {isEditing ? (
        <div className="grid grid-rows-3 md:grid-rows-none md:grid-cols-[3fr_3fr_.75fr] gap-4 align-center">
          {fields.map((field, index) => {
            return (
              <Input
                key={`${field.name}-${index}`}
                label={field.label}
                disabled={!isEditing}
                id={`${field.name}-${index}`}
                type={field.type}
                value={inputValues[index]}
                onChange={(e) => {
                  const updatedInputValues = [...inputValues];
                  updatedInputValues[index] = e.target.value;
                  setInputValues(updatedInputValues);
                }}
              />
            );
          })}

          <button
            onClick={handleAdd}
            className="text-sm justify-self-end self-center px-2 py-1 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md"
          >
            Add
          </button>
        </div>
      ) : (
        ""
      )}

      {items.length > 0 && (
        <div className="bg-gray-800 p-3 gap rounded-md mt-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex md:flex-row flex-col justify-between items-center gap-2 bg-gray-700 py-2 md:p-2 rounded-md my-1"
            >
              {fields.map((field) => (
                <Input
                  label={field.label}
                  key={`${field.name}-${index}`}
                  id={`${field.name}-${index}`}
                  name={field.name}
                  type={field.type}
                  value={item[field.name] || ""}
                  disabled={!isEditing || !item.editing}
                  onChange={(e) => handleInputChange(e, index, field.name)}
                />
              ))}

              {/* Controls: Edit, Save, Delete */}
              {isEditing && (
                <div className="flex gap-4 md:self-center self-end px-2">
                  {item.editing ? (
                    <FaCheck
                      className="text-green-500 hover:text-green-700 cursor-pointer"
                      onClick={() => handleSaveEdit(index)}
                    />
                  ) : (
                    <FaEdit
                      className="text-yellow-500 hover:text-yellow-700 cursor-pointer"
                      onClick={() => handleEditItem(index)}
                    />
                  )}
                  <FaTrash
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                    onClick={() => handleDeleteItem(index)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};
