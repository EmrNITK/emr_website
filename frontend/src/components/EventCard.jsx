import React from "react";

function EventCard({ event, action, onActionClick, isLive }) {
  return (
    <div
      className={`bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all border ${
        isLive ? "border-red-500" : "border-blue-500"
      }`}
    >
      <img
        src={event.poster}
        alt={event.name}
        className="w-full h-48 object-cover rounded-xl mb-4"
      />
      <h2 className="text-2xl font-semibold text-white">{event.name}</h2>
      <p className="text-gray-300 mt-2 mb-4">{event.details}</p>
      <button
        onClick={() => onActionClick(event)}
        className={`block text-center ${
          isLive
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-500 hover:bg-blue-600"
        } text-white font-bold py-2 px-4 rounded-lg transition-colors`}
      >
        {action}
      </button>
    </div>
  );
}

export default EventCard;
