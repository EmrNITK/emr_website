import React, { useState } from "react";

const ParticipantsDashboard = ({ participants }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [selectedYear, setSelectedYear] = useState(""); // For filtering by year

  const filteredUsers = participants
    .filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((user) => (showVerifiedOnly ? user.isVerified : true))
    .filter((user) => (selectedYear ? user.year === selectedYear : true)); // Filter by selected year

  return (
    <>
      <div className="px-6 min-h-[100vh]">
        <div className="flex flex-col p-4 md:flex-row justify-center mb-4">
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-md p-2 mb-2 md:mb-0 md:mr-4"
          />
          <button
            onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
            className="p-2 bg-blue-500 text-white rounded-md mb-2 md:mb-0 md:mr-4"
          >
            {showVerifiedOnly ? "Show All Users" : "Show Verified Only"}
          </button>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="p-2 border text-white border-gray-800 rounded-md"
          >
            <option value="">All Years</option>
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
          </select>
        </div>

        {loading ? (
          <p className="text-center">Loading users...</p>
        ) : filteredUsers.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-800 shadow-lg rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-600">
                  <th className="px-4 py-2 border border-gray-800">S.No</th>
                  <th className="px-4 py-2 border border-gray-800">Name</th>
                  <th className="px-4 py-2 border border-gray-800">Email</th>
                  <th className="px-4 py-2 border border-gray-800">Roll No.</th>
                  <th className="px-4 py-2 border border-gray-800">College</th>
                  <th className="px-4 py-2 border border-gray-800">Year</th>
                  <th className="px-4 py-2 border border-gray-800">
                    Mobile No
                  </th>
                  <th className="px-4 py-2 border border-gray-800">Verified</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user._id} className="hover:bg-gray-900">
                    <td className="px-4 py-2 border border-gray-800">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 border border-gray-800">
                      {user.name}
                    </td>
                    <td className="px-4 py-2 border border-gray-800">
                      {user.email}
                    </td>
                    <td className="px-4 py-2 border border-gray-800">
                      {user.rollNo}
                    </td>
                    <td className="px-4 py-2 border border-gray-800">
                      {user.collegeName}
                    </td>
                    <td className="px-4 py-2 border border-gray-800">
                      {user.year}
                    </td>
                    <td className="px-4 py-2 border border-gray-800">
                      {user.mobileNo}
                    </td>
                    <td className="px-4 py-2 border border-gray-800">
                      {user.isVerified ? "Yes" : "No"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center mt-4">No users found.</p>
        )}

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        {message && (
          <p className="text-green-500 text-center mt-4">{message}</p>
        )}
      </div>
    </>
  );
};

export default ParticipantsDashboard;
