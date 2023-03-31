import React from "react";
import type { ComponentStory, ComponentMeta } from "@storybook/react";
import EncounterForm from "../pages/encounters/encounter-form";

const Story: ComponentMeta<typeof EncounterForm> = {
  component: EncounterForm,
  title: "EncounterForm",
};
export default Story;

const Template: ComponentStory<typeof EncounterForm> = (args) => (
  <EncounterForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
