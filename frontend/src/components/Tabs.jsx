import { useState } from "react";

const Tabs = ({ tabs, content }) => {
  const [active, setActive] = useState(0);

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-700 mb-6">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActive(index)}
            className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${
              active === index
                ? "text-blue-400 border-b-2 border-blue-400 bg-blue-400/5"
                : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/30"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div className="min-h-[500px]">
        {content[active]}
      </div>
    </div>
  );
};

export default Tabs;
