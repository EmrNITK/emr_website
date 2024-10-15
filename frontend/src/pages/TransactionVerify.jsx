import React, { useState } from "react";
import { verifyUser } from "../api/apiService";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header"
const VerifyTransaction = () => {
  const [transactionId, setTransactionId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async () => {
    setError("");
    setLoading(true);

    // Input validation
    if (!transactionId.trim()) {
      setError("Transaction ID cannot be empty.");
      setLoading(false);
      return;
    }

    try {
      // const userData = { transactionId };
      const response = await verifyUser(transactionId);

      console.log("Verifying transaction ID:", transactionId);

      if (response && response.ok) {
        navigate("/workshop/createteam");
      } else {
        setError(
          response?.message ||
            "Verification failed. Please check the Transaction ID."
        );
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred during verification.");
    } finally {
      setLoading(false);
      setTransactionId("");
    }
  };

  return (
    <div>
      <Header />
    <div className="flex items-center justify-center h-screen ">
      <div className="p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Verify Transaction
        </h2>
        <input
          type="text"
          placeholder="Enter Transaction ID"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          className="w-full p-2 mb-4 rounded-md border border-gray-600 bg-gray-700 text-white"
        />
        <button
          onClick={handleVerify}
          className="w-full p-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </div>
    </div>
    </div>
  );
};

export default VerifyTransaction;
