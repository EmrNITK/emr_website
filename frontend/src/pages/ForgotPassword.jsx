import React, { useState } from "react";
import { changePassword, verifyOTP, sendOTP } from "../api/apiService";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1 = email input, 2 = OTP verification, 3 = password reset
  const [loading, setLoading] = useState(false);

  // Email validation function
  const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);

  // Handle sending OTP
  const handleSendOTP = async () => {
    if (!email || !isEmailValid(email)) {
      setError("Please enter a valid email address.");
      setMessage("");
      return;
    }

    setLoading(true);
    try {
      await sendOTP(email);
      setMessage("OTP has been sent to your email.");
      setError("");
      setStep(2); // Move to OTP verification step
    } catch (error) {
      setError("Failed to send OTP. Please try again.");
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  // Handle verifying OTP
  const handleVerifyOTP = async () => {
    if (!otp) {
      setError("Please enter the OTP.");
      setMessage("");
      return;
    }

    setLoading(true);
    try {
      await verifyOTP(email, otp);
      setMessage("OTP verified. You can now reset your password.");
      setError("");
      setStep(3); // Move to password reset step
    } catch (error) {
      setError(error.message); // Use the error message from the thrown error
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  // Handle changing password
  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Both password fields are required.");
      setMessage("");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match. Please try again.");
      setMessage("");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      setMessage("");
      return;
    }

    setLoading(true);
    try {
      await changePassword(email, newPassword);
      setMessage("Password has been successfully reset.");
      setError("");
      navigate("/login");
    } catch (error) {
      setError(error.message);
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white">
      <Header />
      <div className="flex justify-center items-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-1400 p-8 shadow-lg rounded-lg w-full max-w-md bg-white/5  backdrop-opacity-5 backdrop-brightness-10 shadow-lg backdrop-blur-sm">
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-center font-mono">
                Forgot Password
              </h2>
              <p className="mb-4 text-center font-mono">
                Enter registered email
              </p>
              <input
                className="w-full p-4 mb-4 border rounded-lg bg-transparent border-b border-gray-300 focus:outline-none"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email"
              />
              <button
                onClick={handleSendOTP}
                className={`w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 mx-auto ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-center">
                Verify OTP
              </h2>
              <p className="mb-4 text-center">
                Enter the OTP sent to your email.
              </p>
              <input
                className="w-full p-4 mb-4 border rounded-lg bg-transparent border-b border-gray-300 focus:outline-none"
                type="email"
                placeholder="Email"
                value={email}
                readOnly
                aria-label="Email"
              />
              <input
                className="w-full p-4 mb-4 border rounded-lg bg-transparent border-b border-gray-300 focus:outline-none"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                aria-label="OTP"
              />
              <button
                onClick={handleVerifyOTP}
                className={`w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          )}
          {step === 3 && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-center">
                Reset Password
              </h2>
              <p className="mb-4 text-center">Enter your new password.</p>
              <input
                className="w-full p-4 mb-4 border rounded-lg bg-transparent border-b border-gray-300 focus:outline-none"
                type="email"
                placeholder="Email"
                value={email}
                readOnly
                aria-label="Email"
              />
              <input
                className="w-full p-4 mb-4 border rounded-lg bg-transparent border-b border-gray-300 focus:outline-none"
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                aria-label="New Password"
              />
              <input
                className="w-full p-4 mb-4 border rounded-lg bg-transparent border-b border-gray-300 focus:outline-none"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                aria-label="Confirm Password"
              />
              <button
                onClick={handleChangePassword}
                className={`w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
            </>
          )}
          {message && (
            <p className="font-mono text-sm mt-4 text-center text-green-400">
              {message}
            </p>
          )}
          {error && (
            <p className="font-mono text-sm mt-4 text-center text-red-400">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
