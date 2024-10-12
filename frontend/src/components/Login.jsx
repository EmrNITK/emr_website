import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import { useNavigate, Link } from 'react-router-dom'; 
import { loginUser } from '../api/apiService';

const Login = () => {
  const { login } = useContext(AuthContext); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userData = { username, password };
      const response = await loginUser(userData);
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
        backgroundImage: 'url("https://images.pexels.com/photos/14887693/pexels-photo-14887693.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load")', // Main background image here
      }}
    >
      <div className="flex flex-col md:flex-row max-w-4xl shadow-lg w-full md:w-4/5">
        <div
          className="md:w-1/2 w-full p-8 text-white flex items-center bg-black bg-opacity-50 rounded-t-lg md:rounded-l-lg md:rounded-t-none" // Opacity, rounded corners
          style={{
            backgroundImage: 'url("/path-to-left-box-image.png")', 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
          }}
        >
          <div>
            <h1 className="text-3xl font-bold mb-4">Welcome Page</h1>
            <p className="text-lg">
              Sign in to continue access to our amazing platform.
            </p>
          </div>
        </div>

        {/* Right side form */}
        <div className="bg-white w-full md:w-1/2 p-8 rounded-b-lg md:rounded-r-lg md:rounded-l-none">
          <h2 className="text-2xl font-bold mb-6">Sign in</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <input
              className="w-full p-3 mb-4 border border-gray-300 rounded"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="w-full p-3 mb-4 border border-gray-300 rounded"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="w-full bg-red-500 text-white py-3 rounded" type="submit">
              Sign in
            </button>
          </form>

          {/* Forgot Password link */}
          <div className="mt-4 text-center">
            <Link to="/forgot-password" className="text-blue-500 hover:underline">
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
