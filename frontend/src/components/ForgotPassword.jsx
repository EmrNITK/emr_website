import React, { useState } from "react";
import { changePassword, verifyOTP,sendOTP } from "../api/apiService";
import {useNavigate} from 'react-router-dom';
import Header from "../components/Header";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1); // 1 = email input, 2 = OTP verification, 3 = password reset
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    setLoading(true);
    try {
      await sendOTP(email);
      setMessage("OTP has been sent to your email.");
      setStep(2); // Move to OTP verification step
    } catch (error) {
      setMessage("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      await verifyOTP(email,otp);
      setMessage("OTP verified. You can now reset your password.");
      setStep(3); // Move to password reset step
    } catch (error) {
      setMessage(error.message); // Use the error message from the thrown error
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("Passwords don't match. Please try again.");
      return;
    }

    setLoading(true);
    try {
      await changePassword(email,newPassword)
      setMessage("Password has been successfully reset.");
      navigate("/login");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" min-h-screen text-white">
      {" "}
      {/* Set background color and text color */}
      <Header />
      <div className="flex justify-center items-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-1400 p-8 shadow-lg rounded-lg w-full max-w-md">
          {" "}
          {/* Set background for the form */}
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-center">
                Forgot Password
              </h2>
              <p className="mb-4 text-center">
                Enter your email to receive an OTP.
              </p>
              <input
                className="w-full p-4 mb-4 border border-gray-600 rounded-lg" // Increased padding and border radius
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
                {loading ? "Sending..." : "Send OTP"}{" "}
                {/* Or "Verifying..." or "Changing Password" based on the context */}
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
                className="w-full p-4 mb-4 border border-gray-600 rounded-lg" // Increased padding and border radius
                type="email"
                placeholder="Email"
                value={email}
                readOnly // Make email field read-only
                aria-label="Email"
              />
              <input
                className="w-full p-4 mb-4 border border-gray-600 rounded-lg" // Increased padding and border radius
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
                className="w-full p-4 mb-4 border border-gray-600 rounded-lg" // Increased padding and border radius
                type="email"
                placeholder="Email"
                value={email}
                readOnly // Make email field read-only
                aria-label="Email"
              />
              <input
                className="w-full p-4 mb-4 border border-gray-600 rounded-lg" // Increased padding and border radius
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                aria-label="New Password"
              />
              <input
                className="w-full p-4 mb-4 border border-gray-600 rounded-lg" // Increased padding and border radius
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
            <p className="mt-4 text-center text-green-400">{message}</p> // Adjusted the message color
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
