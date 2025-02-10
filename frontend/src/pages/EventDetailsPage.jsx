import React from 'react';
import { useLocation } from 'react-router-dom';

function EventDetailsPage() {
    const location = useLocation();
    const { event } = location.state;
    
    return (
        <div className="p-8 min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
            <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h1 className="text-4xl font-bold mb-4 text-center text-blue-400">{event.name}</h1>
                <p className="text-gray-300 mb-6 text-center">{event.details}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-900 p-4 rounded-xl shadow-md">
                        <h2 className="text-2xl font-semibold mb-3 text-blue-300">Participants</h2>
                        <ul className="text-gray-400 space-y-1">
                            {event.participants.map((participant, index) => (
                                <li key={index} className="border-b border-gray-700 pb-1">{participant}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-xl shadow-md">
                        <h2 className="text-2xl font-semibold mb-3 text-blue-300">Teams</h2>
                        <ul className="text-gray-400 space-y-1">
                            {event.teams.map((team, index) => (
                                <li key={index} className="border-b border-gray-700 pb-1">{team}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-xl shadow-md">
                        <h2 className="text-2xl font-semibold mb-3 text-blue-300">Leaderboard</h2>
                        <ul className="text-gray-400 space-y-1">
                            {event.leaderboard.map((entry, index) => (
                                <li key={index} className="border-b border-gray-700 pb-1">
                                    <span className="text-white font-medium">{entry.name}</span>: {entry.score}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventDetailsPage;