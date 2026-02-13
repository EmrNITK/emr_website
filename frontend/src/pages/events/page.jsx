import { Routes, Route } from 'react-router-dom';
import EventsPage from './EventsPage';
import EventDetail from './EventDetail';

export default function Page() {
  return (
      <Routes>
        <Route path="/" element={<EventsPage />} />
        <Route path="/:slug" element={<EventDetail />} />
      </Routes>
  );
}