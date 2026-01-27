import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProjectsPage from './ProjectsPage';
import ProjectDetail from './ProjectDetail';

export default function Page() {
  return (
      <Routes>
        <Route path="/" element={<ProjectsPage />} />
        <Route path="/:slug" element={<ProjectDetail />} />
      </Routes>
  );
}