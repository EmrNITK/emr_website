import React, { useState } from "react";
import Accordion from "../components/Accordion";
import ListManager from "../components/ListManager";
import FooterComp from "../components/Footer";

const CreateEvent = () => {
  const [eventDetails, setEventDetails] = useState({
    eventName: "",
    date: "",
    venue: "",
    members: "",
    rulebookLink: "",
    amount: "",
    description: "",
    coordinators: [],
    usefulLinks: [],
  });

  const [showPopup, setShowPopup] = useState(false);

  const handleSaveEvent = () => {
    setEventDetails((prev) => ({ ...prev }));
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveSection = (section) => {
    console.log(`Saved ${section}:`, eventDetails[section]);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
  };

  return (
    <>
      <div className="min-h-[100vh]">
        <div className="flex flex-wrap justify-between items-center px-5 py-4 md:px-10">
          <h1 className="text-white font-bold text-2xl pl-5 md:pl-10">Create Event</h1>
          <div className="flex space-x-3 md:space-x-4 pr-5 md:pr-10">
            <button
              onClick={handleSaveEvent}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 md:px-6 md:py-3 rounded-md"
            >
              Save
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 md:px-6 md:py-3 rounded-md">
              Make Live
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-h-[80vh] flex justify-center p-3 md:p-5 overflow-y-auto">
          <div className="flex flex-col gap-4 p-4 md:p-6 rounded-lg w-full max-w-2xl">
            <Accordion title="Basic Details" onSave={() => handleSaveSection("eventName")}>
              <input
                type="text"
                name="eventName"
                placeholder="Event Name"
                value={eventDetails.eventName}
                onChange={handleInputChange}
                className="p-2 border-b-2 border-gray-400/50 bg-transparent focus:outline-none"
              />
              <input
                type="date"
                name="date"
                value={eventDetails.date}
                onChange={handleInputChange}
                className="p-2 border-b-2 border-gray-400/50 bg-transparent focus:outline-none"
              />
              <input
                type="text"
                name="venue"
                placeholder="Venue"
                value={eventDetails.venue}
                onChange={handleInputChange}
                className="p-2 border-b-2 border-gray-400/50 bg-transparent focus:outline-none"
              />
              <input
                type="number"
                name="members"
                placeholder="No of Members"
                value={eventDetails.members}
                onChange={handleInputChange}
                className="p-2 border-b-2 border-gray-400/50 bg-transparent focus:outline-none"
              />
              <input type="file" className="p-2 border-b-2 border-gray-400/50 bg-transparent focus:outline-none" />
            </Accordion>

            <Accordion title="Description" onSave={() => handleSaveSection("description")}>
              <textarea
                name="description"
                value={eventDetails.description}
                onChange={handleInputChange}
                className="p-2 border-b-2 border-gray-400/50 bg-transparent focus:outline-none"
                placeholder="Event Description"
              />
            </Accordion>

            <Accordion title="Rulebook" onSave={() => handleSaveSection("rulebookLink")}>
              <input
                type="text"
                name="rulebookLink"
                placeholder="Rulebook Link"
                value={eventDetails.rulebookLink}
                onChange={handleInputChange}
                className="p-2 border-b-2 border-gray-400/50 bg-transparent focus:outline-none"
              />
            </Accordion>

            <Accordion title="Registration Fee" onSave={() => handleSaveSection("amount")}>
              <input
                type="text"
                name="amount"
                placeholder="Amount"
                value={eventDetails.amount}
                onChange={handleInputChange}
                className="p-2 border-b-2 border-gray-400/50 bg-transparent focus:outline-none"
              />
              <input type="file" className="p-2 border-b-2 border-gray-400/50 bg-transparent focus:outline-none" />
            </Accordion>

            <Accordion title="Coordinators" onSave={() => handleSaveSection("coordinators")}>
              <ListManager
                items={eventDetails.coordinators}
                setItems={(newList) => setEventDetails((prev) => ({ ...prev, coordinators: newList }))}
                placeholder1="Name"
                placeholder2="Mobile Number"
              />
            </Accordion>

            <Accordion title="Useful Links" onSave={() => handleSaveSection("usefulLinks")}>
              <ListManager
                items={eventDetails.usefulLinks}
                setItems={(newList) => setEventDetails((prev) => ({ ...prev, usefulLinks: newList }))}
                placeholder1="Title"
                placeholder2="Link"
              />
            </Accordion>
          </div>
        </div>

        {showPopup && (
          <div className="fixed bottom-4 right-4 z-50">
            <div className="w-48 h-16 bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-50 animate-spin-slow"></div>
              <h2 className="text-white font-semibold z-10">Saved Successfully</h2>
            </div>
          </div>
        )}
      </div>
      <FooterComp />
    </>
  );
};

export default CreateEvent;