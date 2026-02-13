import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WorkshopsPage from "./workshops/page";
import ProtectedRoute from "../components/ProtectedRoute";
import EventsPage from "./events/page";
import GalleryPage from "./gallery/page";
import TeamPage from "./team/page";
import ProjectsPage from "./projects/page";
import SponsorPage from "./sponsor/page";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EMRHomePage from './home/page';
import NotFoundPage from '@/components/NotFoundPage';

export default function NavPage() {
  return (
    <>
    <Header />
    <Routes>

      <Route path="/" element={<EMRHomePage />} />
    <Route path="/events/*" element={<EventsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />

        {/* Protected Routes */}
        <Route
          path="/workshops/*"
          element={
            <ProtectedRoute>
              <WorkshopsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/team"
          element={
            <ProtectedRoute>
              <TeamPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/*"
          element={
            <ProtectedRoute>
              <ProjectsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sponsor"
          element={
            <ProtectedRoute>
              <SponsorPage />
            </ProtectedRoute>
          }
        /><Route path="*" element={<NotFoundPage />} />
        </Routes>
        
<Footer />
        </>
  )
}
