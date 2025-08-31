import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import EventDetails from "../components/EventDetails";

const EventDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { event } = location.state || {};

  // Handle case when no event is passed
  if (!event) {
    return (
      <PageLayout title="Event Not Found">
        <div className="text-center py-16">
          <div className="text-gray-400 text-xl mb-4">Event not found</div>
          <p className="text-gray-500 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate("/events/manage")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200"
          >
            Back to Events
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={event.name}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/events/manage")}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Events
          </button>
        </div>

        {/* Event Details */}
        <EventDetails event={event} />
      </div>
    </PageLayout>
  );
};

export default EventDetailsPage;
