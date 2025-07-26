import React from "react";

export default function YearSelector({ years, selectedYear, setSelectedYear }) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
      {Array.isArray(years) && years.length > 0 ? (
        years.map((year) => (
          <button
            key={year}
            className={`px-3 sm:px-5 py-2 rounded-lg border-2 font-semibold transition-colors duration-200 focus:outline-none text-xs sm:text-base ${
              year === selectedYear
                ? "bg-pink-600 text-white border-pink-700 dark:bg-pink-700 dark:text-white dark:border-pink-800"
                : "bg-white dark:bg-gray-900 text-pink-600 dark:text-pink-400 border-pink-600 dark:border-pink-400 hover:bg-pink-50 dark:hover:bg-gray-800"
            }`}
            onClick={() => setSelectedYear(year)}
          >
            {year}
          </button>
        ))
      ) : (
        <div className="text-gray-400 dark:text-gray-500">No years available</div>
      )}
    </div>
  );
}

