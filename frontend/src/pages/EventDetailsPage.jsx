import React from "react";
import { useLocation } from "react-router-dom";
import Tabs from "../components/Tabs";
import ParticipantsDashboard from "../components/ParticipantsDashboard";
import TeamDashboard from "../components/TeamDashboard";
import PageLayout from "../components/PageLayout";

const EventDetailsPage = () => {
  const location = useLocation();
  const { event } = location.state;

  const tabs = ["Details", "Participants", "Teams", "Leaderboard"];
  const content = [
    <div> {/* Details Content */} </div>,
    <div>
      {" "}
      <ParticipantsDashboard participants={event.participants} />{" "}
    </div>,
    <div>
      {" "}
      <TeamDashboard teams={event.teams} />{" "}
    </div>,
    <div> {/* Submit Content */} </div>,
  ];

  return (
    <PageLayout title={event.name}>
      <Tabs tabs={tabs} content={content} />
    </PageLayout>
  );
};

export default EventDetailsPage;
