import React, { useState } from "react";
import PageLayout from "../components/PageLayout";
import { EventForm } from "../components/EventForm";

const CreateEventPage = () => {
  return (
    <PageLayout title={"Create Event "}>
      <div className={"flex justify-center"}>
        <EventForm />
      </div>
    </PageLayout>
  );
};

export default CreateEventPage;
