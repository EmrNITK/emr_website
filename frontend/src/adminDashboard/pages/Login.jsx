// Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Login = ({ setToken }) => {
  const [creds, setCreds] = useState({ username: '', password: '' });
  
  // Ensure your .env has VITE_API_BASE_URL (e.g., http://localhost:3000)
  const API_URL = import.meta.env.VITE_API_BASE_URL + '/api';

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 1. Send credentials
      // 2. { withCredentials: true } allows the browser to receive and set the httpOnly cookie
      await axios.post(
        `${API_URL}/login`, 
        creds, 
        { withCredentials: true } 
      );

      // 3. Since we don't get the raw token string anymore (it's in the cookie),
      // we just set a truthy value here so the parent component knows we are logged in.
      setToken("auth-active"); 
      
      toast.success("Welcome back!");
    } catch (err) {
      console.error(err);
      toast.error("Invalid Credentials");
    }
  };

  return (
     <div className="h-screen w-full bg-black flex items-center justify-center relative overflow-hidden">
       {/* Background Gradient */}
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black"></div>
       
       <div className="bg-zinc-950 p-8 rounded-2xl border border-zinc-800 w-full max-w-md relative z-10 shadow-2xl shadow-blue-900/20">
         <h1 className="text-3xl font-bold mb-2 text-white">Admin Access</h1>
         <p className="text-zinc-500 mb-6">Enter your secure credentials to continue.</p>
         
         <form onSubmit={handleLogin} className="space-y-4">
             <div>
               <label className="text-zinc-400 text-sm mb-1 block">Username</label>
               <input 
                 type="text" 
                 onChange={(e) => setCreds({ ...creds, username: e.target.value })} 
                 className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all" 
                 placeholder="Enter username"
               />
             </div>
             
             <div>
               <label className="text-zinc-400 text-sm mb-1 block">Password</label>
               <input 
                 type="password" 
                 onChange={(e) => setCreds({ ...creds, password: e.target.value })} 
                 className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all" 
                 placeholder="Enter password"
               />
             </div>

             <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-900/50 mt-4">
               Login
             </button>
          </form>
       </div>
    </div>
  );
};

export default Login;