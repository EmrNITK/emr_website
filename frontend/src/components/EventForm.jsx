import React, { useContext } from "react";
import { EventDynamicListSection } from "./EventDynamicListSection";
import { EventFormProvider } from "../context/EventFormContext";
import { EventFormSection } from "./EventFormSection";
import { EventDescriptionSection } from "./EventDescripitonSection";
import { EventFormControls } from "./EventFormControls";
import { EventFormContext } from "../context/EventFormContext";

// Inner component that can access the context
const EventFormContent = ({ disabled, onSave, isLoading }) => {
  const { eventData, updatedValues } = useContext(EventFormContext);
  
  const handleSave = async () => {
    if (onSave) {
      const formDataToSend = { ...eventData, ...updatedValues };
      await onSave(formDataToSend);
    }
  };

  return (
    <div className="w-full">
      <div className="max-h-[70vh] no-scrollbar flex flex-col gap-6 rounded-lg overflow-y-auto">
        <EventFormSection
          disabled={disabled}
          section={"basicDetails"}
          title={"Basic Details"}
          fields={[
            { type: "text", name: "name", value: "", label: "Event Name:" },
            { type: "date", name: "date", value: "", label: "Event Date:" },
            { type: "text", name: "venue", value: "", label: "Venue:" },
            {
              type: "number",
              name: "numberOfMember",
              value: "",
              label: "No of Members:",
            },
            {
              type: "file",
              name: "poster",
              value: "",
              label: "Upload Poster:",
            },
          ]}
        />
        <EventDescriptionSection disabled={disabled} />
        <EventFormSection
          disabled={disabled}
          section={"ruleBook"}
          title={"Rulebook"}
          fields={[
            {
              type: "text",
              name: "ruleBook",
              value: "",
              label: "Rulebook Link:",
            },
          ]}
        />
        <EventFormSection
          disabled={disabled}
          section={"registrationFee"}
          title={"Registration Fee"}
          fields={[
            { type: "number", name: "amount", value: "", label: "Amount:" },
            { type: "file", name: "qrCode", value: "", label: "Upload QR:" },
          ]}
        />
        <EventDynamicListSection
          disabled={disabled}
          section={"coordinator"}
          title={"Coordinators"}
          fields={[
            { type: "text", name: "name", value: "", label: "Name:" },
            { type: "tel", value: "", name: "mobileNo", label: "Mobile No" },
          ]}
        />
        <EventDynamicListSection
          disabled={disabled}
          section={"usefulLinks"}
          title={"Useful Links"}
          fields={[
            { type: "text", name: "title", value: "", label: "Title:" },
            { type: "text", value: "", name: "link", label: "Link:" },
          ]}
        />
      </div>
      
      {/* Enhanced Action Buttons */}
      <div className="mt-8 pt-6 border-t border-gray-700/50">
        {onSave ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isLoading ? (
                <div className="flex items-center text-green-400 font-medium">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400 mr-2"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center text-gray-400 text-sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Review your changes before saving
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <button
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                onClick={() => onSave(null)} // Cancel
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                onClick={handleSave}
                disabled={isLoading}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <EventFormControls disabled={disabled} />
          </div>
        )}
      </div>
    </div>
  );
};

export const EventForm = ({ initialData, disabled, onSave, isLoading }) => {
  return (
    <>
      <EventFormProvider initialData={initialData}>
        <EventFormContent disabled={disabled} onSave={onSave} isLoading={isLoading} />
      </EventFormProvider>
    </>
  );
};
