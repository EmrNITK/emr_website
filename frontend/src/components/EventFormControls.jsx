import React, { useContext, useState } from "react";
import { EventFormContext } from "../context/EventFormContext";
import { createEvent, updateEvent } from "../api/apiService";
import { useNavigate } from "react-router-dom";
import { useApiRequest } from "@/hooks/useApiRequest.jsx";

export const EventFormControls = ({ disabled }) => {
  const { eventData } = useContext(EventFormContext);
  const [isLive, setIsLive] = useState(eventData.isLive);
  const { request, loading } = useApiRequest();
  const navigate = useNavigate();

  const handleSave = async () => {
    const apiCall = disabled
      ? () => updateEvent(eventData)
      : () => createEvent(eventData);

    const successMessage = disabled
      ? "Event updated successfully!"
      : "Event created successfully!";
    const response = await request(apiCall, successMessage);

    if (response) navigate("/events/manage");
  };

  const handlePublishing = () => {};
  return (
    <>
      <div className="flex space-x-4">
        <button
          className="px-5 py-2 bg-green-600 active:bg-green-900 
             text-gray-300 active:text-gray-500 font-medium rounded-md border border-gray-600 
             shadow-sm hover:shadow-md "
          onClick={handleSave}
        >
          {loading
            ? "Processing..."
            : disabled
            ? "Update Event"
            : "Create Event"}
        </button>

        <button
          onClick={handlePublishing}
          className="px-5 py-2 bg-red-600 active:bg-red-900
             text-gray-300 font-medium rounded-md border border-gray-600 
             shadow-sm active:shadow-md transition"
        >
          { isLive ? "Unpublish" : "Publish"}
        </button>
      </div>
    </>
  );
};
