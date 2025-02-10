import React from 'react';
import { events } from '../utils/data';
import { Link } from 'react-router-dom';

export default function ManageEvents() {
  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-400">Manage Events</h1>
      
      {/* Live Events Section */}
      <div className="mb-6">
        <div className="flex justify-start mb-4">
          <span className="px-6 py-2 bg-red-600 text-white font-bold text-lg rounded-full shadow-md">Live Events</span>
        </div>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {events.filter(event => event.isLive).map((event) => (
            <div key={event.id} className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-red-500">
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
              <h2 className="text-2xl font-semibold text-white">{event.name}</h2>
              <p className="text-gray-300 mt-2 mb-4">{event.details}</p>
              <Link
                to='event'
                state={{ event: event }}
                className="block text-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
      
      {/* Other Events Section */}
      <div className="mt-12">
        <div className="flex justify-start mb-4">
          <span className="px-6 py-2 bg-blue-600 text-white font-bold text-lg rounded-full shadow-md">Other Events</span>
        </div>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {events.filter(event => !event.isLive).map((event) => (
            <div key={event.id} className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-blue-500">
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
              <h2 className="text-2xl font-semibold text-white">{event.name}</h2>
              <p className="text-gray-300 mt-2 mb-4">{event.details}</p>
              <Link
                to='event'
                state={{ event: event }}
                className="block text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}