import React from "react";
import PageLayout from "../components/PageLayout";
import MultiPageEventForm from "../components/MultiPageEventForm";

const CreateEventPage = () => {
  return (
    <PageLayout title={""}>
      <MultiPageEventForm />
    </PageLayout>
  );
};

export default CreateEventPage;
