import React, { createContext, useState } from "react";

export const EventFormContext = createContext();

export const EventFormProvider = ({ children, initialData = {} }) => {
  const [eventData, setEventData] = useState({
    basicDetails: initialData.basicDetails || {},
    description: initialData.description || "",
    rulebook: initialData.rulebook || {},
    registrationFee: initialData.registrationFee || {},
    coordinators: initialData.coordinators || [],
    usefulLinks: initialData.usefulLinks || [],
    updatedFields: {}, // Track fields that are updated for editing mode
  });

  // Update a specific section and track changes
  const updateSection = (section, newData) => {
    setEventData((prev) => ({
      ...prev,
      [section]: newData,
      updatedFields: { ...prev.updatedFields, [section]: true },
    }));
  };

  return (
    <EventFormContext.Provider value={{ eventData, updateSection }}>
      {children}
    </EventFormContext.Provider>
  );
};
