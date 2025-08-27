import React, { useContext, useState } from "react";
import { EventFormContext } from "../context/EventFormContext";
import { createEvent, updateEvent } from "../api/apiService";
import { useNavigate } from "react-router-dom";
import { useApiRequest } from "@/hooks/useApiRequest.jsx";

export const EventFormControls = ({ disabled }) => {
  const { eventData, updatedValues } = useContext(EventFormContext);
  const [isLive, setIsLive] = useState(eventData.isLive);
  const { request, loading } = useApiRequest({ enableToast: true });
  const navigate = useNavigate();

  const handleSave = async () => {
    const { _id, ...data } = eventData;
    const apiCall = disabled
      ? () => updateEvent(eventData._id, updatedValues)
      : () => createEvent(data);

    const successMessage = disabled
      ? "Event updated successfully!"
      : "Event created successfully!";
    const response = await request(apiCall, successMessage);

    if (response) navigate("/events/manage");
  };

  const handlePublishing = async () => {
    const { _id, ...data } = eventData;
    const apiCall = eventData._id
      ? eventData.isLive
        ? () =>
            updateEvent(eventData._id, {
              ...updatedValues,
              isLive: false,
            })
        : () =>
            updateEvent(eventData._id, {
              ...updatedValues,
              isLive: true,
            })
      : () => createEvent({ ...data, isLive: true });

    const successMessage = eventData.isLive
      ? "Event unpublished succesfully!"
      : "Event published successfully!";

    const response = await request(apiCall, successMessage);

    if (response) navigate("/events/manage");
  };

  return (
    <div className="flex space-x-3 items-center gap-3">
      {loading ? (
        <div className="flex items-center text-green-400 font-medium">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400 mr-2"></div>
          Processing...
        </div>
      ) : null}
      
      <button
        className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
        onClick={handleSave}
        disabled={loading}
      >
        {disabled ? "Update Event" : "Create Event"}
      </button>

      <button
        onClick={handlePublishing}
        disabled={loading}
        className={`px-5 py-2.5 font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 ${
          isLive
            ? "bg-orange-600 hover:bg-orange-700 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {isLive ? "Unpublish Event" : "Publish Event"}
      </button>
    </div>
  );
};
