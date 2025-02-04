import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { changePasswordUser } from "../api/apiService"; // Import the change password API call
import Header from "../components/Header";

const ChangePassword = () => {
  const { user } = useContext(AuthContext); // Assuming you have user context to get email
  const [currentPassword, setCurrentPassword] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = async () => {
    try {
      const passwordData = { email, currentPassword, newPassword }; // Use user email from context
      const response = await changePasswordUser(passwordData);
      console.log("response", response);
      setSuccessMessage("Password changed successfully!");
      alert("password changed successfully");
      navigate("/login");
    } catch (error) {
      setError(error.message); // Set error message if the request fails
    }
  };

  return (
    <div>
      <Header />
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col md:flex-row max-w-4xl shadow-lg w-full md:w-4/5">
          <div
            className="md:w-1/2 w-full p-8 text-white flex items-center bg-opacity-50 rounded-t-lg md:rounded-l-lg md:rounded-t-none"
            style={{
              backgroundImage: 'url("/path-to-left-box-image.png")',
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div>
              <h1 className="text-3xl font-bold mb-4">Change Password</h1>
              <p className="text-lg font-bold mb-3">
                Enter your current password and a new password to update.
              </p>
            </div>
          </div>

          {/* Right side form */}
          <div className="w-full md:w-1/2 p-8 rounded-b-lg md:rounded-r-lg md:rounded-l-none">
            <h2 className="text-2xl font-bold mb-6">Update Password</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {successMessage && (
              <p className="text-green-500 mb-4">{successMessage}</p>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleChangePassword();
              }}
            >
              <input
                className="w-full p-4 mb-4 border border-gray-700 rounded-lg"
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required // Make it required
              />
              <input
                className="w-full p-4 mb-4 border border-gray-700 rounded-lg"
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required // Make it required
              />
              <input
                className="w-full p-4 mb-4 border border-gray-600 rounded-lg"
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required // Make it required
              />
              <button
                className="w-full bg-blue-500 text-white py-3 rounded"
                type="submit"
              >
                Change Password
              </button>
            </form>

            {/* Optional: Link back to Login or other pages */}
            <div className="mt-4 text-center">
              <Link to="/login" className="text-blue-500 hover:underline">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
