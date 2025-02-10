import React from "react";
import { events } from "../utils/data";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import EventsSection from "../components/EventSection";

export default function ManageEventsPage() {
  console.log(events);
  const navigate = useNavigate();
  return (
    <PageLayout title={"Manage Events"}>
      <EventsSection
        title="Live Events"
        events={events.filter((event) => event.isLive)}
        isLive={true}
        navigate={navigate}
      />

      <EventsSection
        title="Other Events"
        events={events.filter((event) => !event.isLive)}
        isLive={false}
        navigate={navigate}
      />
    </PageLayout>
  );
}
