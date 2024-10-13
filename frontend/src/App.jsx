import { BrowserRouter } from "react-router-dom";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navbar, StarsCanvas } from "./components";
import Home from "./pages/Home";
import GalleryComp from "./pages/GalleryPage";
import SponsorPage from "./components/Sponsor/Sponsor";
import WorkshopPage from "./pages/WorkshopPage";
import TeamComp from "./pages/TeamPage";
import Blog from "./pages/Blog";
import ContactUs from "./components/ContactUs/Contact";
import EventPage from "./pages/eventpage";
import ScrollToTop from "./ScrollToTop";
import WorkshopDetail from "./components/WorkshopPage/WorkshopDetail";
import TeamsPage from "./pages/TeamsPage";
import CreateTeam from "./pages/CreateTeam";

import WorkshopInfo from "./components/WorkshopInfo";
import Register from "./components/Register";
import Login from "./components/Login";
import { AuthProvider } from "./context/AuthContext";
import ForgotPassword from "./components/ForgotPassword";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        {/* <Navbar/> */}
        <StarsCanvas />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/team" element={<TeamComp />} />
          <Route path="/sponsor" element={<SponsorPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/event" element={<EventPage />} />
          <Route path="/workshop-details" element={<WorkshopDetail />} />
          <Route path="/gallery" element={<GalleryComp />} />
          <Route path="/workshop" element={<WorkshopInfo />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/workshop/createteam" element={<CreateTeam />} />
          <Route path="/workshop/jointeam" element={<TeamsPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
