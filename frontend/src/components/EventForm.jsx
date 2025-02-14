import React from "react";
import { EventDynamicListSection } from "./EventDynamicListSection";
import { EventFormProvider } from "../context/EventFormContext";
import { EventFormSection } from "./EventFormSection";
import { EventDescriptionSection } from "./EventDescripitonSection";
import { EventFormControls } from "./EventFormControls";

export const EventForm = ({ initialData, disabled }) => {
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
          <div className="justify-self-end flex flex-col items-center justify-center text-center py-2">
            <EventFormControls disabled={disabled} />
          </div>
        </div>
      </EventFormProvider>
    </>
  );
};
