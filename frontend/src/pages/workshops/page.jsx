import { Routes, Route } from 'react-router-dom';
import WorkshopsPage from './WorkshopsPage';
import WorkshopDetail from './WorkshopDetail';

export default function Page() {
  return (
      <Routes>
        <Route path="/" element={<WorkshopsPage />} />
        <Route path="/:slug" element={<WorkshopDetail />} />
      </Routes>
  );
}