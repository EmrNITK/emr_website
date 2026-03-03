import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import Login from './pages/Login';
import RoleSelection from './pages/RoleSelection';
import DetailsForm from './pages/DetailsForm';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';

axios.defaults.withCredentials = true;

export default function App() {
  return (
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/details-form" element={<DetailsForm />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
  );
}