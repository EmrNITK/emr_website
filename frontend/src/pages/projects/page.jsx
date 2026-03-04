import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ProjectsPage from './ProjectsPage';
import ProjectDetail from './ProjectDetail';
import { useAuth } from '../../context/AuthContext';
import { Edit } from 'lucide-react';


export default function Page() {
    const { user, isLoading } = useAuth();
  
  return (
    <>
      <Routes>
        <Route path="/" element={<ProjectsPage />} />
        <Route path="/:slug" element={<ProjectDetail />} />
      </Routes>
      {!isLoading && user && (user.userType === "admin" || user.userType === "super-admin") && (
              <Link to={'/admin/projects'} className="fixed bottom-6 right-6 h-12 w-12 bg-blue-800 text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition z-[100]">
                <Edit size={18} />
              </Link>
            )}
      </>
  );
}