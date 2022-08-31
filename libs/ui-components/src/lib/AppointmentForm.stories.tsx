import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AppointmentForm } from './AppointmentForm';

export default {
  component: AppointmentForm,
  title: 'AppointmentForm',
} as ComponentMeta<typeof AppointmentForm>;

const Template: ComponentStory<typeof AppointmentForm> = (args) => (
  <AppointmentForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
