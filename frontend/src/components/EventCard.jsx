import React from "react";
import {
  getEventStatus,
  getStatusColor,
  getStatusTextColor,
  formatDate,
  formatTime
} from "../utils/eventUtils";

function EventCard({ event, onActionClick }) {
  const status = getEventStatus(event.date);
  const statusColor = getStatusColor(status);
  const statusTextColor = getStatusTextColor(status);

  return (
    <div 
      className="group relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/70 transition-all duration-300 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1 cursor-pointer"
      onClick={() => onActionClick(event)}
    >
      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusColor} text-white shadow-lg`}>
          <span className={`w-2 h-2 rounded-full mr-2 ${status === 'Live' ? 'animate-pulse bg-white' : 'bg-white'}`}></span>
          {status}
        </span>
      </div>

      {/* Event Image */}
      <div className="relative mb-6 overflow-hidden rounded-xl">
        <img
          src={event.poster || '/placeholder-event.jpg'}
          alt={event.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzE3OC45NTQgMTUwIDE2MiAxMzMuMDQ2IDE2MiAxMTJDMTYyIDkwLjk1NCAxNzguOTU0IDc0IDIwMCA3NEMyMjEuMDQ2IDc0IDIzOCA5MC45NTQgMjM4IDExMkMyMzggMTMzLjA0NiAyMjEuMDQ2IDE1MCAyMDAgMTUwWiIgZmlsbD0iIzlDQTBBNiIvPgo8cGF0aCBkPSJNMzAwIDIyNkMzMDAgMjI2IDI2MCAyMDAgMjAwIDIwMEMxNDAgMjAwIDEwMCAyMjYgMTAwIDIyNlYyNThIMzAwVjIyNloiIGZpbGw9IiM5Q0EwQTYiLz4KPC9zdmc+';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>

      {/* Event Content */}
      <div className="space-y-4">
        {/* Event Name */}
        <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-200 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {event.name}
        </h3>

        {/* Date and Time */}
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center text-gray-300">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center text-gray-400">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formatTime(event.date)}</span>
          </div>
        </div>

        {/* Venue */}
        {event.venue && (
          <div className="flex items-center text-gray-400 text-sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{event.venue}</span>
          </div>
        )}

        {/* Description */}
        {event.description && (
          <p className="text-gray-300 text-sm leading-relaxed overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
            {event.description}
          </p>
        )}

        {/* Event Type Badge */}
        {event.isWorkshop !== undefined && (
          <div className="flex items-center">
            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
              event.isWorkshop
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
            }`}>
              {event.isWorkshop ? 'Workshop' : 'Event'}
            </span>
          </div>
        )}

                 {/* Click Indicator */}
         <div className="mt-4 flex items-center justify-center text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
           <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
           </svg>
           Click to view details
         </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
}

export default EventCard;
