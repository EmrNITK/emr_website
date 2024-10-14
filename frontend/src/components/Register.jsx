import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/apiService";

const Register = () => {
  const { login } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const userData = {
        name,
        email,
        password,
        branch,
        collegeName,
        mobileNo,
        rollNo,
      };
      const response = await registerUser(userData);
      login(response);
      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen "
     
    >
      <div className="flex flex-col md:flex-row max-w-4xl  w-full md:w-4/5">
        <div
          className="relative md:w-1/2 w-full p-8 flex items-center justify-center  bg-center"
        
        >
          <div className="absolute inset-0 bg-gray-800 bg-opacity-0"></div>
          <p className="relative text-white text-xl text-center">
            Welcome! Create an account to get started.
          </p>
        </div>

        <div className=" w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold  mb-6">Sign up</h2>
          {error && <p className="text-blue-500 mb-4">{error}</p>}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}
          >
            <input
              className="w-full p-3 mb-4 border border-gray-300 rounded"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="w-full p-3 mb-4 border border-gray-300 rounded"
              type="text"
              placeholder="Roll No."
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
            />
            <input
              className="w-full p-3 mb-4 border border-gray-300 rounded"
              type="text"
              placeholder="Branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            />
            <input
              className="w-full p-3 mb-4 border border-gray-300 rounded"
              type="text"
              placeholder="College Name"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
            />
            <input
              className="w-full p-3 mb-4 border border-gray-300 rounded"
              type="text"
              placeholder="Mobile No."
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
            />
            <input
              className="w-full p-3 mb-1 border border-gray-300 rounded"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full p-3 mb-4 border border-gray-300 rounded"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="w-full bg-blue-500 text-white py-3 rounded"
              type="submit"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
