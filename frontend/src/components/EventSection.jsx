import React from "react";
import EventCard from "./EventCard";

const EventsSection = ({ title, events, isLive, navigate }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-start mb-4">
        <span
          className={`px-6 py-2 text-white font-bold text-lg rounded-full shadow-md ${
            isLive ? "bg-red-600" : "bg-blue-600"
          }`}
        >
          {title}
        </span>
      </div>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            action="View Details"
            onActionClick={() =>
              navigate("/manage-events/event", { state: { event } })
            }
            isLive={isLive}
          />
        ))}
      </div>
    </div>
  );
};

export default EventsSection;
