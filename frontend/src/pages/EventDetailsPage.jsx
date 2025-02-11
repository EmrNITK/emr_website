import React from "react";
import { useLocation } from "react-router-dom";
import Tabs from "../components/Tabs";
import ParticipantsDashboard from "../components/ParticipantsDashboard";
import TeamDashboard from "../components/TeamDashboard";
import PageLayout from "../components/PageLayout";
import { EventForm } from "../components/EventForm";

const EventDetailsPage = () => {
  const location = useLocation();
  const { event } = location.state;

  const tabs = ["Details", "Participants", "Teams", "Leaderboard"];
  const content = [
    <EventForm initialData={event} disabled={true} />,

    <ParticipantsDashboard participants={event.participants} />,

    <TeamDashboard teams={event.teams} />,
    <div> {/* Submit Content */} </div>,
  ];

  return (
    <PageLayout title={event.name}>
      <div className="flex justify-center">
        <Tabs tabs={tabs} content={content} />
      </div>
    </PageLayout>
  );
};

export default EventDetailsPage;
