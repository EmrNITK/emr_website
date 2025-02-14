import React from "react";

export const Input = ({
  id,
  type,
  name,
  fileName,
  value,
  onChange,
  placeholder,
  label,
  disabled,
  hidden,
}) => {
  return (
    <>
      <div className="grid grid-rows-2 md:grid-rows-none md:grid-cols-2 justify-items-start md:items-center">
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type={type}
          name={name}
          value={value}
          disabled={disabled}
          hidden={hidden}
          className={
            !disabled
              ? `border-b-2 border-gray-400/50 bg-transparent focus:outline-none`
              : "bg-transparent focus:outline-none"
          }
          onChange={onChange}
          placeholder={placeholder}
        />
        {type == "file" && (
          <label
            htmlFor={id}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg cursor-pointer hover:bg-gray-700"
          >
            {!fileName?"Choose File":fileName}
          </label>
        )}
      </div>
    </>
  );
};
