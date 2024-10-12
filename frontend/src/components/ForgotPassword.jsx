import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordReset = async () => {
    // Implement API call to send reset password link
    try {
      // Example API call:
      // await resetPassword(email);
      setMessage('Password reset link has been sent to your email.');
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: '#d4edda' }} 
    >
      <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md sm:max-w-lg md:max-w-md lg:max-w-lg xl:max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
        <p className="mb-4 text-center">Enter your email to receive a password reset link.</p>
        <input
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handlePasswordReset}
          className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition-colors duration-200"
        >
          Send Reset Link
        </button>
        {message && <p className="mt-4 text-green-500 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
