import { Routes, Route, Link } from 'react-router-dom';
import EventsPage from './EventsPage';
import EventDetail from './EventDetail';
import { useAuth } from '../../context/AuthContext';
import { Edit } from 'lucide-react';

export default function Page() {
  const { user, isLoading } = useAuth();
  return (
    <>
      <Routes>
        <Route path="/" element={<EventsPage />} />
        <Route path="/:slug" element={<EventDetail />} />
      </Routes>
      {!isLoading && user && (user.userType === "admin" || user.userType === "super-admin") && (
        <Link to={'/admin/events'} className="fixed bottom-6 right-6 h-12 w-12 bg-blue-800 text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition z-[100]">
          <Edit size={18} />
        </Link>
      )}
    </>
  );
}