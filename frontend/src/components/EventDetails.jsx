import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  getEventStatus, 
  getStatusColor, 
  formatDate, 
  formatTime 
} from "../utils/eventUtils";
import { showToast } from "../utils/toast";
import { updateEvent, deleteEvent } from "../api/apiService";
import EventEditForm from "./EventEditForm";

const EventDetails = ({ event, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const status = getEventStatus(event.date);
  const statusColor = getStatusColor(status);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const eventId = event._id || event.id;
      await deleteEvent(eventId);
      showToast.largeSuccess("Event deleted successfully!");
    setShowDeleteConfirm(false);
      navigate("/events/manage");
    } catch (error) {
      showToast.largeError("Failed to delete event. Please try again.");
      console.error("Delete error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (formData) => {
    setIsLoading(true);
    try {
      const eventId = event._id || event.id;
      if (!eventId) {
        throw new Error("Event ID not found");
      }

      console.log("Updating event with ID:", eventId);
      console.log("FormData being sent:", formData);

      const response = await updateEvent(eventId, formData);
      console.log("Update response:", response);
      
      showToast.largeSuccess("Event updated successfully!");
      setIsEditing(false);
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error("Update error details:", error);
      const errorMessage = error.message || error.response?.data?.message || "Failed to update event. Please try again.";
      showToast.largeError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // If editing, show the dedicated edit form
  if (isEditing) {
    return (
      <EventEditForm 
        event={event}
                onSave={handleSave}
        onCancel={handleCancelEdit}
                isLoading={isLoading}
              />
    );
  }

  return (
    <>
      <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-4">
        {/* Header */}
        <div className="border-b border-white/10 pb-4 mb-4">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-white">{event.name}</h1>
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor}`}>
                  {status}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
                <span>{event.isWorkshop ? "Workshop" : "Event"}</span>
                <span>•</span>
                <span>{formatDate(event.date)}</span>
                <span>•</span>
                <span>{formatTime(event.date)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Image & Stats */}
          <div className="lg:col-span-1 space-y-4">
            {/* Event Poster */}
            {event.poster && (
              <div className="bg-white/5 rounded border border-white/10 overflow-hidden">
                <img
                  src={event.poster}
                  alt={event.name}
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-white/5 rounded border border-white/10 p-3">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Event Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Venue</span>
                  <span className="text-white text-sm font-medium">{event.venue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Max Participants</span>
                  <span className="text-white text-sm font-medium">{event.numberOfMember}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Registration Fee</span>
                  <span className="text-white text-sm font-medium">₹{event.amount || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-4">
            {/* Description */}
            {event.description && (
              <div className="bg-white/5 rounded border border-white/10 p-3">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Description</h3>
                <div 
                  className="text-white text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              </div>
            )}

            {/* Rules & Links */}
            {(event.ruleBook || event.qrCode) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.ruleBook && (
                  <div className="bg-white/5 rounded border border-white/10 p-3">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Rulebook</h3>
                    <a 
                      href={event.ruleBook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      View Rulebook →
                    </a>
                  </div>
                )}

                {event.qrCode && (
                  <div className="bg-white/5 rounded border border-white/10 p-3">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Payment QR Code</h3>
                    <div className="flex justify-center">
                      <img 
                        src={event.qrCode} 
                        alt="Payment QR Code" 
                        className="w-20 h-20 object-contain bg-white rounded"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Coordinators */}
            {event.coordinator && event.coordinator.length > 0 && (
              <div className="bg-white/5 rounded border border-white/10 p-3">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Coordinators</h3>
                <div className="space-y-2">
                  {event.coordinator.map((coord, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-white/5 rounded border border-white/10">
                      <div className="w-8 h-8 bg-blue-500/20 rounded flex items-center justify-center">
                        <span className="text-blue-400 text-sm font-medium">
                          {coord.name?.charAt(0)?.toUpperCase() || 'C'}
                        </span>
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{coord.name}</p>
                        <p className="text-gray-400 text-xs">{coord.mobileNo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Useful Links */}
            {event.usefulLinks && event.usefulLinks.length > 0 && (
              <div className="bg-white/5 rounded border border-white/10 p-3">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Useful Links</h3>
                <div className="space-y-2">
                  {event.usefulLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 bg-white/5 rounded border border-white/10 hover:bg-white/10 transition-colors text-sm"
                    >
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span className="text-white">{link.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal - Rendered outside the main container */}
      {showDeleteConfirm && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div 
            className="bg-gray-900/95 border border-gray-700/50 rounded-2xl p-8 max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Delete Event</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete "{event.name}"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventDetails;
