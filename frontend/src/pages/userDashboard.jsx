import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchUsers } from "../api/apiService";
import { useNavigate } from "react-router-dom";
import FooterComp from "../components/Footer/FooterComp";

const TeamDashboard = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [fetching, setFetching] = useState(false);
    const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setFetching(true);
                const response = await fetchUsers();
                setUsers(response);
            } catch (error) {
                setError("Failed to fetch users. Please try again.");
                setMessage("");
            } finally {
                setFetching(false);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (!user.isAdmin) {
            navigate("/workshop");
        }
    }, [user, navigate]);

    const filteredUsers = users
        .filter((user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter((user) => (showVerifiedOnly ? user.isVerified : true));

    return (
        <>
            <div className="px-6">
                <h1 className="text-2xl md:text-4xl font-extrabold text-center text-blue-800 mt-10 mb-8">
                    User Dashboard
                </h1>

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
                        className="p-2 bg-blue-500 text-white rounded-md"
                    >
                        {showVerifiedOnly ? "Show All Users" : "Show Verified Only"}
                    </button>
                </div>

                {loading ? (
                    <p className="text-center">Loading users...</p>
                ) : (
                    filteredUsers.length ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-800 shadow-lg rounded-lg overflow-hidden">
                                <thead>
                                    <tr className="bg-gray-600">
                                        <th className="px-4 py-2 border border-gray-800">S.No</th>
                                        <th className="px-4 py-2 border border-gray-800">Name</th>
                                        <th className="px-4 py-2 border border-gray-800">Branch</th>
                                        <th className="px-4 py-2 border border-gray-800">College</th>
                                        <th className="px-4 py-2 border border-gray-800">Year</th>
                                        <th className="px-4 py-2 border border-gray-800">Mobile No</th>
                                        <th className="px-4 py-2 border border-gray-800">Verified</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user, index) => (
                                        <tr key={user._id} className="hover:bg-gray-900">
                                            <td className="px-4 py-2 border border-gray-800">{index + 1}</td>
                                            <td className="px-4 py-2 border border-gray-800">{user.name}</td>
                                            <td className="px-4 py-2 border border-gray-800">{user.branch}</td>
                                            <td className="px-4 py-2 border border-gray-800">{user.collegeName}</td>
                                            <td className="px-4 py-2 border border-gray-800">{user.year}</td>
                                            <td className="px-4 py-2 border border-gray-800">{user.mobileNo}</td>
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
                    )
                )}

                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                {message && <p className="text-green-500 text-center mt-4">{message}</p>}
            </div>
            <FooterComp />
        </>
    );
};

export default TeamDashboard;
