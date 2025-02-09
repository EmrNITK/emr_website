import React from "react";
import { FaTrash } from "react-icons/fa";

const ListManager = ({ items, setItems, placeholder1, placeholder2, isEditing }) => {
  const [newItem, setNewItem] = React.useState({ field1: "", field2: "" });

  const handleAdd = () => {
    if (newItem.field1.trim() && newItem.field2.trim()) {
      setItems([...items, newItem]);
      setNewItem({ field1: "", field2: "" });
    }
  };

  const handleDelete = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-3">
      {isEditing && (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={placeholder1}
            value={newItem.field1}
            onChange={(e) => setNewItem({ ...newItem, field1: e.target.value })}
            className="p-2 border-b-2 border-gray-400/50 bg-transparent focus:outline-none w-full"
          />
          <input
            type="text"
            placeholder={placeholder2}
            value={newItem.field2}
            onChange={(e) => setNewItem({ ...newItem, field2: e.target.value })}
            className="p-2 border-b-2 border-gray-400/50 bg-transparent focus:outline-none w-full"
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md"
          >
            Add
          </button>
        </div>
      )}

      {items.length > 0 && (
        <div className="p-3 rounded-md">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-700 p-2 rounded-md my-1">
              {isEditing ? (
                <span className="text-white">
                  {item.field1} - {item.field2}
                </span>
              ) : (
                <span className="text-white">
                  <strong>{placeholder1}:</strong> {item.field1} &nbsp;&nbsp;
                  <strong>{placeholder2}:</strong> {item.field2}
                </span>
              )}
              {isEditing && (
                <button onClick={() => handleDelete(index)} className="text-red-500 hover:text-red-700">
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListManager;