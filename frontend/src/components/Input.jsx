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
    <div className="w-full">
      <div className="space-y-2">
        <label 
          htmlFor={id}
          className="block text-sm font-medium text-white"
        >
          {label}
        </label>
        
        {type === "file" ? (
          <div className="space-y-2">
            <input
              id={id}
              type={type}
              name={name}
              disabled={disabled}
              hidden={true}
              onChange={onChange}
              className="sr-only"
            />
            <label
              htmlFor={id}
              className={`inline-flex items-center px-4 py-3 border border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                disabled
                  ? "border-gray-600 text-gray-400 cursor-not-allowed"
                  : "border-blue-500 text-blue-400 hover:border-blue-400 hover:bg-blue-500/10"
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              {fileName || "Choose File"}
            </label>
            {fileName && (
              <p className="text-sm text-green-400 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                File selected: {fileName}
              </p>
            )}
          </div>
        ) : (
          <input
            id={id}
            type={type}
            name={name}
            value={value}
            disabled={disabled}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              disabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-white/20 focus:bg-white/20"
            }`}
          />
        )}
      </div>
    </div>
  );
};
