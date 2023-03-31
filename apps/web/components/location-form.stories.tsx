import type { ComponentStory, ComponentMeta } from "@storybook/react";
import LocationForm from "../pages/admin/locations/location-form";
import React from 'react';

const Story: ComponentMeta<typeof LocationForm> = {
  component: LocationForm,
  title: "LocationForm",
};
export default Story;

const Template: ComponentStory<typeof LocationForm> = (args) => (
  <LocationForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
