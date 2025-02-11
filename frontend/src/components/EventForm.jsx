import React from "react";
import { EventDynamicListSection } from "./EventDynamicListSection";
import { EventFormProvider } from "../context/EventFormContext";
import { EventFormSection } from "./EventFormSection";
import { EventDescriptionSection } from "./EventDescripitonSection";

export const EventForm = ({ initialData, disabled }) => {
  const handleSave = () => {
    
  };
  const handleMakeLive = () => {};

  return (
    <>
      <EventFormProvider initialData={initialData}>
        <div className="grid grid-cols-1 items-center p-3 md:p-5 w-full lg:w-[60%]">
          <div className="max-h-[60vh] no-scrollbar flex flex-col gap-4 rounded-lg overflow-y-auto">
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
                  name: "noOfMembers",
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
              section={"rulebook"}
              title={"Rulebook"}
              fields={[
                {
                  type: "text",
                  name: "link",
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
                { type: "file", name: "qr", value: "", label: "Upload QR:" },
              ]}
            />
            <EventDynamicListSection
              disabled={disabled}
              section={"coordinators"}
              title={"Coordinators"}
              fields={[
                { type: "text", name: "cName", value: "", label: "Name:" },
                { type: "tel", value: "", name: "cMobile", label: "Mobile No" },
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
          <div className="justify-self-end flex flex-col items-center justify-center text-center py-2">
            <div className="flex space-x-4">
              <button
                className="px-5 py-2 bg-green-600 hover:bg-green-900 
             text-gray-300 hover:text-gray-500 font-medium rounded-md border border-gray-600 
             shadow-sm hover:shadow-md transition"
                onClick={handleSave}
              >
                Save
              </button>

              <button
                onClick={handleMakeLive}
                className="px-5 py-2 bg-red-600 hover:bg-red-900
             text-gray-300 font-medium rounded-md border border-gray-600 
             shadow-sm hover:shadow-md transition"
              >
                Make Live
              </button>
            </div>
          </div>
        </div>
      </EventFormProvider>
    </>
  );
};
