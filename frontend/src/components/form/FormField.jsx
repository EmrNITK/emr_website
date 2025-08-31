import React from "react";

const FormField = ({ 
  label, 
  name, 
  type = "text", 
  value, 
  onChange, 
  error, 
  placeholder, 
  required = false,
  disabled = false,
  className = "",
  helperText,
  ...props 
}) => {
  const id = `field-${name}`;
  
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-white"
      >
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      
      {type === "textarea" ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-sm ${
            error 
              ? "border-red-400 bg-red-500/10" 
              : "border-white/20 focus:border-blue-500 bg-white/5"
          } ${disabled ? "bg-gray-800/50 cursor-not-allowed" : ""}`}
          rows={3}
          {...props}
        />
      ) : type === "file" ? (
        <div className="space-y-1.5">
          <input
            id={id}
            name={name}
            type="file"
            onChange={onChange}
            disabled={disabled}
            className="sr-only"
            {...props}
          />
          <label
            htmlFor={id}
            className={`block w-full px-3 py-2 border-2 border-dashed rounded-lg cursor-pointer text-center transition-colors text-sm ${
              error
                ? "border-red-400 bg-red-500/10 text-red-400"
                : "border-white/30 hover:border-white/50 text-gray-300 hover:text-white"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {value?.name || placeholder || "Choose a file"}
          </label>
          {value?.name && (
            <p className="text-xs text-green-400">✓ {value.name}</p>
          )}
        </div>
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-sm ${
            error 
              ? "border-red-400 bg-red-500/10" 
              : "border-white/20 focus:border-blue-500 bg-white/5"
          } ${disabled ? "bg-gray-800/50 cursor-not-allowed" : ""}`}
          {...props}
        />
      )}
      
      {error && (
        <p className="text-xs text-red-400" id={`${id}-error`}>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-xs text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default FormField;
