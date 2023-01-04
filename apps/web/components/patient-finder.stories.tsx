import React from "react";
import type { ComponentStory, ComponentMeta } from "@storybook/react";
import PatientFinder from "./patient-finder";

const Story: ComponentMeta<typeof PatientFinder> = {
  component: PatientFinder,
  title: "PatientFinder",
};
export default Story;

const Template: ComponentStory<typeof PatientFinder> = (args) => (
  <PatientFinder {...args} />
);

console.log("Example Var", process.env.STORYBOOK_ENV);

export const Primary = Template.bind({});
Primary.args = {};
