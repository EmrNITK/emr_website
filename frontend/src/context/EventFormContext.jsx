import React, { createContext, useState } from "react";

export const EventFormContext = createContext();

export const EventFormProvider = ({ children, initialData = {} }) => {
  const [eventData, setEventData] = useState({
    id: initialData._id||"",
    name: initialData.name || "",
    date: initialData.date || "",
    venue: initialData.venue || "",
    numberOfMember: initialData.numberOfMember || "",
    poster: initialData.poster || "",
    description: initialData.description || "",
    ruleBook: initialData.ruleBook || "",
    amount: initialData.amount || "",
    qrCode: initialData.qrCode || "",
    coordinator: initialData.coordinator || [],
    usefulLinks: initialData.usefulLinks || [],
    isLive: initialData.isLive || false,
    updatedFields: {}, // Track fields that are updated for editing mode
  });

  // Update a specific section and track changes
  const updateField = (field, newValue) => {
    setEventData((prev) => ({
      ...prev,
      [field]: newValue,
      updatedFields: { ...prev.updatedFields, [field]: true },
    }));
  };

  return (
    <EventFormContext.Provider value={{ eventData, updateField }}>
      {children}
    </EventFormContext.Provider>
  );
};
