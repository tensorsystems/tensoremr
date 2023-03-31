import type { ComponentStory, ComponentMeta } from "@storybook/react";
import AppointmentTable from "../pages/appointments/appointment-table";
import React from "react";
import { Appointment } from "fhir/r4";
import { differenceInMinutes } from "date-fns";

const Story: ComponentMeta<typeof AppointmentTable> = {
  component: AppointmentTable,
  title: "AppointmentTable",
};
export default Story;

const Template: ComponentStory<typeof AppointmentTable> = (args) => (
  <AppointmentTable {...args} />
);

const items = [
  {
    mrn: "1",
    patientName: "Kidus Tiliksew",
    providerName: "Dr. Zelalem Eshetu",
    appointmentType: "Walkin",
    serviceType: "Ophthalmology",
    status: "proposed",
    response: "needs-action",
    specialty: "Anesthics",
    start: new Date(),
    end: new Date(),
    duration: differenceInMinutes(new Date(), new Date()),
  },
  {
    mrn: "2",
    patientName: "Abebe Kebede",
    providerName: "Dr. Zelalem Eshetu",
    appointmentType: "Walkin",
    serviceType: "Ophthalmology",
    status: "proposed",
    response: "accepted",
    comment: "This is a comment",
    duration: 30,
  },
  {
    mrn: "3",
    patientName: "Abebe Kebede",
    providerName: "Dr. Zelalem Eshetu",
    appointmentType: "Walkin",
    serviceType: "Ophthalmology",
    status: "proposed",
    response: "declined",
    comment: "This is a comment",
    duration: 30,
  },
];

export const Search = Template.bind({});

Search.args = {
  variant: "search",
  items: items,
};

export const Requests = Template.bind({});

Requests.args = {
  variant: "requests",
  items: items,
};
