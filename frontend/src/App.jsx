import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Loader from "./components/Loader";
import ProtectedRoute from "./components/ProtectedRoute";

import WorkshopsPage from "./pages/workshops/page";
import EventsPage from "./pages/events/page";
import GalleryPage from "./pages/gallery/page";
import TeamPage from "./pages/team/page";
import ProjectsPage from "./pages/projects/page";
import SponsorPage from "./pages/sponsor/page";
import EMRHomePage from './pages/home/page';
import Header from './components/Header';
import AdminDash from './adminDashboard/page';
import NavPage from './pages/page';
import NotFoundPage from './components/NotFoundPage';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // simulate app loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
    
      <Routes>
        <Route path="/" element={<Navigate to="/p" />} />
        <Route path="/p/*" element={<NavPage />}/>
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminDash />
            </ProtectedRoute>
          }
        />
         <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
