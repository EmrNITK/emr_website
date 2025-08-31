import React from "react";
import EventCard from "./EventCard";

const EventsSection = ({ title, events, navigate, emptyMessage = "No events found" }) => {
  if (!events || events.length === 0) {
    return (
      <div className="mb-8">
        <div className="flex justify-start mb-6">
          <span className="px-6 py-2 text-white font-bold text-lg rounded-full shadow-md bg-gray-600">
            {title}
          </span>
        </div>
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">{emptyMessage}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex justify-start mb-6">
        <span className="px-6 py-2 text-white font-bold text-lg rounded-full shadow-md bg-gradient-to-r from-blue-600 to-purple-600">
          {title} ({events.length})
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {events.map((event, index) => (
          <EventCard
            key={event.id || `event-${index}`}
            event={event}
            onActionClick={() =>
              navigate("/events/manage/event", { state: { event } })
            }
          />
        ))}
      </div>
    </div>
  );
};

export default EventsSection;
