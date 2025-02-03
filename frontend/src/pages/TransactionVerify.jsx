import React, { useState, useContext, useEffect } from "react";
import { verifyUser } from "../api/apiService";
import { Link, Navigate } from "react-router-dom";
import Header from "../components/Header";
import { AuthContext } from "../context/AuthContext";
import FooterComp from "../components/Footer";
// import payment_qr from "../assets/payment_qr.jpg";

const VerifyTransaction = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [transactionId, setTransactionId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // New state for verification status



  // Fetch updated user data from the backend
  useEffect(() => {
    const fetchUpdatedUserData = async () => {
      try {
        if (user) {
          await updateUser();
        }
      } catch (error) {
        console.error("Error fetching updated user data:", error);
      }
    };

    fetchUpdatedUserData();
  }, []);


  const handleVerify = async () => {
    setError("");
    setLoading(true);

    // Input validation
    if (!transactionId.trim()) {
      setError("Please enter Transaction ID");
      setLoading(false);
      return;
    }

    try {
      const response = await verifyUser(transactionId);
      alert(`${response.message} Wait for verification from admin`);
      setMessage(`${response.message} Wait for verification from admin`)
      setIsVerified(true); // Set verification status to true
    } catch (error) {
      console.error(error);
      setError(error.message || "An error occurred during verification.");
    } finally {
      setLoading(false);
      setTransactionId("");
    }
  };



  return (
    <div>
      <Header />
      {user.isVerified ? <Navigate to="/synapse" /> : <></>}
      <div className="flex mt-20 items-center justify-center h-screen ">
        <div className="p-8 max-w-md w-full bg-white/5 backdrop-opacity-5 backdrop-brightness-10 shadow-lg backdrop-blur-sm rounded-lg ">
          <h2 className="text-2xl font-bold text-white text-center mb-6 font-mono">
            Verify Transaction
          </h2>

          <div className="flex items-center justify-center">
            <img className="h-60 w-2/3" src={payment_qr} alt="Payment QR" />
          </div>
          <p className="text-normal mt-4 text-white text-center mb-6 font-mono">
            Registration Fee: ₹ 50
          </p>
          <p className="text-xs mt-4 text-green-500 text-center mb-6 font-mono">
            Once your payment is verified by us, you’ll receive an email notification.
          </p>
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
          {error && (
            <p className="mt-4 font-mono text-red-500 text-center text-sm">
              {error}
            </p>
          )}
          {message && (
            <div className="text-center">
              <p className="mt-4 font-mono text-green-500 text-center text-sm">
                {message}
              </p>
              <div className="center font-mono">
                <Link
                  to="/"
                  className="text-blue-500 hover:text-white text-sm underline"
                >
                  Go to home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <FooterComp />
    </div>
  );
};

export default VerifyTransaction;
