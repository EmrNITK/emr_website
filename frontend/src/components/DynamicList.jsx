import React, { useContext, useState } from "react";
import { EventFormContext } from "../context/EventFormContext";
import useUpdateEffect from "../hooks/useUpdateEffect";
import { FaTrash, FaEdit, FaCheck, FaPlus } from "react-icons/fa";
import { Input } from "./Input";

export const DynamicList = ({ fields, section, isEditing }) => {
  const { eventData, updateField } = useContext(EventFormContext);
  const [items, setItems] = useState(eventData[section] || []);
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

  const handleDeleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleEditItem = (index) => {
    const updatedItems = [...items];
    updatedItems[index].editing = true;
    setItems(updatedItems);
  };

  const handleSaveEdit = (index) => {
    const updatedItems = [...items];
    delete updatedItems[index].editing;
    setItems(updatedItems);
  };

  const handleInputChange = (e, index, field) => {
    const updatedItems = [...items];
    updatedItems[index][field] = e.target.value;
    setItems(updatedItems);
  };

  return (
    <div className="space-y-6">
      {isEditing && (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h4 className="text-lg font-semibold text-white mb-4">Add New Item</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            {fields.map((field, index) => (
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
            ))}
            <button
              onClick={handleAdd}
              className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105"
            >
              <FaPlus className="w-4 h-4" />
              Add Item
            </button>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Current Items</h4>
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 transition-all duration-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
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
                
                {isEditing && (
                  <div className="flex gap-2 justify-end">
                    {item.editing ? (
                      <button
                        onClick={() => handleSaveEdit(index)}
                        className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 hover:scale-105"
                      >
                        <FaCheck className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditItem(index)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:scale-105"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteItem(index)}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 hover:scale-105"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length === 0 && (
        <div className="text-center py-12 text-secondary">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-lg font-medium mb-1">No items added yet</p>
          <p className="text-sm opacity-75">Start by adding your first item above</p>
        </div>
      )}
    </div>
  );
};
