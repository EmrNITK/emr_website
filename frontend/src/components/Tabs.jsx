import { useState } from "react";

const Tabs = ({ tabs, content }) => {
  const [active, setActive] = useState(0);

  return (
    <div className="w-full md:w-[80%] flex flex-col items-center gap-4">
      {/* Tab Headers */}
      <div className="w-full grid grid-cols-4 justify-items-center bg-white/10 backdrop-opacity-5 backdrop-brightness-10 shadow-lg backdrop-blur-sm rounded-2xl">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`w-full text-center text-xs text-nowrap md:text-base p-2 rounded-2xl cursor-pointer ${
              active === index ? "bg-white/20" : ""
            }`}
            onClick={() => setActive(index)}
          >
            {tab}
          </div>
        ))}
      </div>
      {/* Tab Content */}
      <div className="w-full flex flex-col items-center text-center md:text-left bg-white/5 backdrop-opacity-100 backdrop-brightness-100 shadow-lg backdrop-blur-lg rounded-3xl p-4">
        {content[active]}
      </div>
    </div>
  );
};

export default Tabs;
