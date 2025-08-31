import React, { useState, useEffect } from "react";

const SearchBar = ({ onSearch, placeholder = "Search events..." }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("All");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm, searchType);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, searchType, onSearch]);

  const getSearchIcon = () => {
    if (searchType === "Date") {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    } else if (searchType === "Status") {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    );
  };

  const detectSearchType = (value) => {
    const term = value.toLowerCase().trim();
    
    // Date detection (YYYY-MM-DD or MM/DD/YYYY)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$|^\d{1,2}\/\d{1,2}\/\d{4}$/;
    if (dateRegex.test(term)) {
      return "Date";
    }
    
    // Status detection
    const statusTerms = ['past', 'live', 'upcoming'];
    if (statusTerms.includes(term)) {
      return "Status";
    }
    
    return "All";
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSearchType(detectSearchType(value));
  };

  return (
    <div className="relative max-w-2xl mx-auto mb-8">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <div className="text-gray-400">
            {getSearchIcon()}
          </div>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
          placeholder={placeholder}
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm("");
              setSearchType("All");
            }}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Search Type Indicator */}
      {searchType !== "All" && (
        <div className="absolute -bottom-8 left-0 text-xs text-gray-400">
          Searching by: <span className="text-blue-400 font-medium">{searchType}</span>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
