import React, { useContext, useState } from "react";
import { EventFormContext } from "../context/EventFormContext";
import { createEvent, updateEvent } from "../api/apiService";
import { useNavigate } from "react-router-dom";

export const EventFormControls = ({ disabled }) => {
  const { eventData } = useContext(EventFormContext);
  const [isLive, setIsLive] = useState(eventData.isLive);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSave = async (e) => {
    console.log(eventData);

    // Form is updated if disabeld is true
    if (disabled) {
      const updatedFields = Object.keys(eventData.updatedFields).reduce(
        (acc, key) => {
          acc[key] = eventData[key];
          return acc;
        },
        {}
      );
      console.log(updatedFields);
      try {
        setError("");
        setMessage("");
        setLoading(true);
        
        const response = await updateEvent(updatedFields);
        navigate("/events/manage");
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }

      return;
    }
    try {
      setLoading(true);
      const response = await createEvent(eventData);
      setMessage("Event Created Successfully!!");
      setError("");
      navigate("/events/manage");
    } catch (error) {
      setError(error.message);
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  const handlePublishing = () => {};
  return (
    <>
      <div className="flex space-x-4">
        {error ? error : ""}
        {message ? message : ""}
        {loading ? "Creating/Updating..." : ""}
        <button
          className="px-5 py-2 bg-green-600 active:bg-green-900 
             text-gray-300 active:text-gray-500 font-medium rounded-md border border-gray-600 
             shadow-sm hover:shadow-md "
          onClick={handleSave}
        >
          {disabled ? "Udpate Event" : "Create Event"}
        </button>

        <button
          onClick={handlePublishing}
          className="px-5 py-2 bg-red-600 active:bg-red-900
             text-gray-300 font-medium rounded-md border border-gray-600 
             shadow-sm active:shadow-md transition"
        >
          {isLive ? "Unpublish" : "Publish"}
        </button>
      </div>
    </>
  );
};
