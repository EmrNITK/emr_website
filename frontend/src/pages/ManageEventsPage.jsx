import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import EventsSection from "../components/EventSection";
import { useApiRequest } from "@/hooks/useApiRequest";
import { getAllEvents } from "@/api/apiService";

export default function ManageEventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const { request, loading } = useApiRequest({ enableToast: false });

  useEffect(() => {
    async function fetch() {
      const response = await request(getAllEvents, "");
      console.log(response);
      setEvents(response.events);
    }

    fetch();
  }, []);

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
