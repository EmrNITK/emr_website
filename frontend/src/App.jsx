import React from "react";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ScrollToTop from "./utils/ScrollToTop";

import StarsCanvas from "./components/Stars.jsx";
import UserOptions from "./components/UserOptions.jsx";
import TeamCard from "./components/TeamCard.jsx";
import ProtectedRoute from "./hoc/ProtectedRoute.jsx";
import VerifiedRoute from "./hoc/VerifiedRoute.jsx";
import AdminRoute from "./hoc/AdminRoute.jsx";
import CreateTeamPage from "./pages/CreateTeamPage.jsx";
import JoinTeamPage from "./pages/JoinTeamPage.jsx";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import SponsorPage from "./pages/Sponsor.jsx";
import RegisterPage from "./pages/RegisterPage";
import TransactionVerifyPage from "./pages/TransactionVerifyPage";
import WorkshopInfo from "./pages/WorkshopInfo";
import TeamDetailsPage from "./pages/TeamDetailsPage";
import SynapseEventPage from "./pages/SynapseEventPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import EventDetailsPage from "./pages/EventDetailsPage.jsx";
import CreateEventPage from "./pages/CreateEventPage.jsx";
import ManageEventsPage from "./pages/ManageEventsPage.jsx";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div className="relative min-h-screen">
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <StarsCanvas />
          <UserOptions />
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#050816',
                color: '#f3f3f3',
                border: '1px solid #aaa6c3',
                borderRadius: '12px',
                padding: '16px 20px',
                fontSize: '16px',
                fontWeight: '500',
                boxShadow: '0px 35px 120px -15px #211e35',
                backdropFilter: 'blur(10px)',
              },
            }}
          />
          <div className="relative z-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sponsor" element={<SponsorPage />} />
              <Route path="/workshop" element={<WorkshopInfo />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              <Route
                path="/userdashboard"
                element={
                  <ProtectedRoute>
                    <AdminRoute>
                      <UserDashboardPage />
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
                      <TeamDetailsPage />
                    </VerifiedRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transactionverify"
                element={
                  <ProtectedRoute>
                    <TransactionVerifyPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/change-password"
                element={
                  <ProtectedRoute>
                    <ChangePasswordPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/workshop/createteam"
                element={
                  <ProtectedRoute>
                    <VerifiedRoute>
                      <CreateTeamPage />
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
              <Route
                path="/events/create"
                element={
                  <CreateEventPage />

                }
              />
              <Route
                path="/events/manage"
                element={
                  <ManageEventsPage />
                }
              />
              <Route
                path="/events/manage/event"
                element={
                  <EventDetailsPage />
                }
              />

            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
};

export default App;
