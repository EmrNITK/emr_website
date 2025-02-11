import React from "react";

export const Input = ({ id, type, name, value, onChange,placeholder, label,disabled }) => {
  return (
    <>
      <div className="grid grid-cols-2 items-center">
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type={type}
          name={name}
          value={value}
          disabled={disabled}
          className={ !disabled
            ? `border-b-2 border-gray-400/50 bg-transparent focus:outline-none`
            : "bg-transparent focus:outline-none"}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    </>
  );
};
