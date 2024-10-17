import { BrowserRouter } from "react-router-dom";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navbar, StarsCanvas } from "./components";
import Home from "./pages/Home";
import GalleryComp from "./pages/GalleryPage";
import SponsorPage from "./components/Sponsor/Sponsor";
import TeamComp from "./pages/TeamPage";
import Blog from "./pages/Blog";
import EventPage from "./pages/eventpage";
import ScrollToTop from "./ScrollToTop";
import WorkshopDetail from "./components/WorkshopPage/WorkshopDetail";
import JoinTeamPage from "./pages/JoinTeamPage";
import CreateTeam from "./pages/CreateTeam";
import WorkshopInfo from "./pages/WorkshopInfo";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AuthProvider} from "./context/AuthContext";
import ForgotPassword from "./pages/ForgotPassword";
import TransactionVerify from "./pages/TransactionVerify";
import TeamCard from "./components/TeamCard";
import TeamDetails from "./pages/TeamDetails";
import ChangePassword from "./components/ChangePassword";
import ProtectedRoute from "./components/ProtectedRoute";
import VerifiedRoute from "./components/VerifiedRoute";
import UserOptions from "./UserOptions";

// const { user, logout } = useContext(AuthContext);

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        {/* <Navbar /> */}
        <StarsCanvas />
        <ProtectedRoute>
          <VerifiedRoute>
            <UserOptions />
          </VerifiedRoute>
        </ProtectedRoute>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sponsor" element={<SponsorPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/team" element={<TeamComp />} />
          <Route path="/event" element={<EventPage />} />
          <Route path="/workshop-details" element={<WorkshopDetail />} />
          <Route path="/gallery" element={<GalleryComp />} />

          <Route path="/workshop" element={<WorkshopInfo />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

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
                  <TeamDetails />
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
