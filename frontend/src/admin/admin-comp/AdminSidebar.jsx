import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AdminSidebar({ options, activeSection, setActiveSection, className }) {
  return (
    <aside className={`w-full md:w-64 bg-white dark:bg-gray-800 shadow-lg p-4 md:p-6 flex flex-row md:flex-col gap-2 md:gap-4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 ${className || ''}`}>
      <h2 className="text-lg md:text-2xl font-bold text-pink-600 dark:text-pink-400 mb-2 md:mb-6 w-full text-center md:text-left">Admin Dashboard</h2>
      <div className="flex flex-row md:flex-col gap-2 md:gap-4 w-full">
        {options.map((opt) => (
          <button
            key={opt.name}
            className={`flex items-center gap-2 md:gap-3 px-2 md:px-4 py-2 rounded-lg font-semibold text-base md:text-lg transition-colors duration-200 focus:outline-none w-full justify-center md:justify-start ${
              activeSection === opt.name
                ? "bg-pink-600 text-white dark:bg-pink-700"
                : "bg-gray-100 dark:bg-gray-900 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-gray-800"
            }`}
            onClick={() => setActiveSection(opt.name)}
          >
            <FontAwesomeIcon icon={opt.icon} />
            <span>{opt.name}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}

