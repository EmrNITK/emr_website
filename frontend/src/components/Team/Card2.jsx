//Web_dev_3.0/frontend/src/components/Team/Card2.jsx

import React, { useEffect, useState } from "react";
import "./TeamSection.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";


const Card2 = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [yearsLoading, setYearsLoading] = useState(true);

  useEffect(() => {
    setYearsLoading(true);
    fetch("http://localhost:3000/api/teampage/years") // API endpoint to get available years
      .then((res) => res.json())
      .then((data) => {
        setYears(data);
        setSelectedYear(data[0]); // Show latest year by default
        setYearsLoading(false);
      })
      .catch(() => setYearsLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedYear) return;
    setLoading(true);
    fetch(`http://localhost:3000/api/teampage?year=${selectedYear}`) // Correct API endpoint to get team by year
      .then((res) => res.json())
      .then((data) => {
        // Sort by order ascending
        setTeamMembers(data.sort((a, b) => a.order - b.order));
        setLoading(false);
      })
      .catch(() => {
        setTeamMembers([]);
        setLoading(false);
      });
  }, [selectedYear]);

  return (
    <section className="team-section w-full max-w-6xl mx-auto px-4 py-12">
      <div className="team-heading text-center mb-8">
        <h2 className="text-4xl font-bold text-pink-600 mb-2">Our Team</h2>
        <p className="team-subtitle text-lg text-gray-500">
          Meet the creative minds behind our success
        </p>
      </div>
      <div className="team-year-selector flex justify-center gap-3 mb-8">
        {yearsLoading ? (
          <div className="text-pink-600 text-base font-medium animate-pulse">
            Loading years...
          </div>
        ) : (
          years.map((year) => (
            <button
              key={year}
              className={`year-btn px-5 py-2 rounded-lg border-2 font-semibold transition-colors duration-200 focus:outline-none ${
                year === selectedYear
                  ? "bg-pink-600 text-white border-pink-700"
                  : "bg-white text-pink-600 border-pink-600 hover:bg-pink-50"
              }`}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </button>
          ))
        )}
      </div>
      <div className="team-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <div className="team-card animate-pulse bg-gray-100 rounded-2xl p-8 text-center min-h-[220px] flex flex-col items-center" key={idx}>
                <div className="team-img-wrapper bg-gray-300 rounded-full w-24 h-24 mb-4" />
                <div className="h-4 w-2/3 bg-gray-300 rounded mb-2" />
                <div className="h-5 w-1/2 bg-gray-300 rounded mb-3" />
                <div className="h-4 w-4/5 bg-gray-300 rounded mb-4" />
                <div className="flex gap-4 justify-center w-1/3">
                  <div className="h-6 w-6 bg-gray-300 rounded-full" />
                  <div className="h-6 w-6 bg-gray-300 rounded-full" />
                  <div className="h-6 w-6 bg-gray-300 rounded-full" />
                </div>
              </div>
            ))
          : teamMembers.map((member, idx) => (
              <div className="team-card bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 text-center transition-shadow duration-200 hover:shadow-xl" key={member._id}>
                <div className="team-img-wrapper w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden shadow">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="team-img w-full h-full object-cover"
                  />
                </div>
                <div className="team-role text-sm text-pink-600 font-semibold uppercase mb-1 tracking-wide">
                  {member.role}
                </div>
                <div className="team-name text-xl font-bold text-pink-700 mb-2">
                  {member.name}
                </div>
                <div className="team-desc text-base text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  {member.desc}
                </div>
                <div className="team-social flex justify-center gap-4 mb-2">
                  <a
                    href={member.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:text-pink-800 text-lg transition-colors"
                  >
                    <FontAwesomeIcon icon={faFacebookF} />
                  </a>
                  <a
                    href={member.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:text-pink-800 text-lg transition-colors"
                  >
                    <FontAwesomeIcon icon={faTwitter} />
                  </a>
                  <a
                    href={member.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:text-pink-800 text-lg transition-colors"
                  >
                    <FontAwesomeIcon icon={faInstagram} />
                  </a>
                </div>
                {/* <div className="team-order text-xs text-gray-400">Order: {member.order}</div> */}
              </div>
            ))}
      </div>
    </section>
  );
};

export default Card2;