import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1); // 1 = email input, 2 = OTP verification, 3 = password reset

  const handleSendOTP = async () => {
    try {
      await axios.post("http://localhost:3000/api/auth/forgot_password/otp", {
        email,
      });
      setMessage("OTP has been sent to your email.");
      setStep(2); // Move to OTP verification step
    } catch (error) {
      setMessage("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/forgot_password/verify",
        {
          email,
          otp,
        }
      );
      setMessage("OTP verified. You can now reset your password.");
      setStep(3); // Move to password reset step
    } catch (error) {
      setMessage("Invalid OTP. Please try again.");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("Passwords don't match. Please try again.");
      return;
    }
    try {
      await axios.post("http://localhost:3000/api/auth/forgot_password/new", {
        email,
        newPassword,
      });
      setMessage("Password has been successfully reset.");
      setStep(1); // Move back to email input step (process complete)
    } catch (error) {
      setMessage("Failed to reset password. Please try again.");
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "#d4edda" }}
    >
      <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Forgot Password
            </h2>
            <p className="mb-4 text-center">
              Enter your email to receive an OTP.
            </p>
            <input
              className="w-full p-3 mb-4 border border-gray-300 rounded"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleSendOTP}
              className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
            >
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>
            <p className="mb-4 text-center">
              Enter the OTP sent to your email.
            </p>
            <input
              className="w-full p-3 mb-4 border border-gray-300 rounded"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full p-3 mb-4 border border-gray-300 rounded"
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={handleVerifyOTP}
              className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
            >
              Verify OTP
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
              className="w-full p-3 mb-4 border border-gray-300 rounded"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full p-3 mb-4 border border-gray-300 rounded"
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              className="w-full p-3 mb-4 border border-gray-300 rounded"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              onClick={handleChangePassword}
              className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
            >
              Change Password
            </button>
          </>
        )}

        {message && (
          <p className="mt-4 text-center text-green-500">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
