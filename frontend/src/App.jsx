import React from "react";
import './index.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ManageEvents from './pages/ManageEvents.jsx';
import { AuthProvider } from "./context/AuthContext";
import ScrollToTop from "./utils/ScrollToTop";

import StarsCanvas from "./components/Stars.jsx";
import UserOptions from "./components/UserOptions.jsx";
import TeamCard from "./components/TeamCard.jsx";
import ProtectedRoute from "./hoc/ProtectedRoute.jsx";
import VerifiedRoute from "./hoc/VerifiedRoute.jsx";
import AdminRoute from "./hoc/AdminRoute.jsx";
import CreateTeam from "./pages/CreateTeam.jsx";
import JoinTeamPage from "./pages/JoinTeamPage.jsx";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";

import SponsorPage from "./pages/Sponsor.jsx";
import SynapseRegister from "./pages/SynapseRegister";
import TransactionVerify from "./pages/TransactionVerify";

import WorkshopInfo from "./pages/WorkshopInfo";
import TeamDetails from "./pages/TeamDetails";
import SynapseEventPage from "./pages/SynapseEventPage";
import TeamDashboard from "./pages/TeamDashboard";
import UserDashboard from "./pages/UserDashboard.jsx";
import EventPage from "./components/EventPage.jsx";
const App = () => {
  return (
    <div className="relative min-h-screen">
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <StarsCanvas />
          <UserOptions />
          <div className="relative z-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sponsor" element={<SponsorPage />} />
              <Route path="/workshop" element={<WorkshopInfo />} />
              <Route path="/register" element={<SynapseRegister />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminRoute>
                      <TeamDashboard />
                    </AdminRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/userdashboard"
                element={
                  <ProtectedRoute>
                    <AdminRoute>
                      <UserDashboard />
                    </AdminRoute>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/teamcard"
                element={
                  <ProtectedRoute>
                    <VerifiedRoute>
                      <TeamCard />
                    </VerifiedRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teamdetails"
                element={
                  <ProtectedRoute>
                    <VerifiedRoute>
                      {/* <TeamDetails /> */}
                    </VerifiedRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transactionverify"
                element={
                  <ProtectedRoute>
                    <TransactionVerify />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/change-password"
                element={
                  <ProtectedRoute>
                    <ChangePassword />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/workshop/createteam"
                element={
                  <ProtectedRoute>
                    <VerifiedRoute>
                      <CreateTeam />
                    </VerifiedRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/workshop/jointeam"
                element={
                  <ProtectedRoute>
                    <VerifiedRoute>
                      <JoinTeamPage />
                    </VerifiedRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/synapse"
                element={
                  <ProtectedRoute>
                    <VerifiedRoute>
                  <SynapseEventPage />
                  </VerifiedRoute>
                  </ProtectedRoute>
                }
              />

              <Route path="/manage-events" element={<ManageEvents />} />
              <Route path="/manage-events/event" element={<EventPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
};

export default App;
