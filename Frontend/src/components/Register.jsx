import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/apiService';

const Register = () => {
  const { login } = useContext(AuthContext); 
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const userData = { username, email, password };
      const response = await registerUser(userData);
      login(response);
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen bg-cover bg-center"
      style={{
        backgroundImage: 'url("https://images.pexels.com/photos/14887693/pexels-photo-14887693.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load")',
        backgroundBlendMode: 'overlay', 
      }}
    >
      <div className="flex flex-col md:flex-row max-w-4xl shadow-lg w-full md:w-4/5">
        <div
          className="relative md:w-1/2 w-full p-8 flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.pexels.com/photos/7868890/pexels-photo-7868890.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
          }}
        >
          <div className="absolute inset-0 bg-gray-800 bg-opacity-60"></div>
          <p className="relative text-white text-xl text-center">Welcome! Create an account to get started.</p>
        </div>

        <div className="bg-white w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold mb-6">Sign up</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
            <input 
              className="w-full p-3 mb-4 border border-gray-300 rounded" 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
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
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="w-full bg-red-500 text-white py-3 rounded" type="submit">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
