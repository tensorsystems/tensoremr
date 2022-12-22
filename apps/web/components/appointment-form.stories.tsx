import type { ComponentStory, ComponentMeta } from "@storybook/react";
import AppointmentForm from "./appointment-form";

const Story: ComponentMeta<typeof AppointmentForm> = {
  component: AppointmentForm,
  title: "AppointmentForm",
};
export default Story;

const Template: ComponentStory<typeof AppointmentForm> = (args) => (
  <AppointmentForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
