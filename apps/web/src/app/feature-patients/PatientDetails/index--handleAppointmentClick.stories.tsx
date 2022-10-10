import { ComponentStory, ComponentMeta } from '@storybook/react';
import { handleAppointmentClick } from './index';

export default {
  component: handleAppointmentClick,
  title: 'handleAppointmentClick',
} as ComponentMeta<typeof handleAppointmentClick>;

const Template: ComponentStory<typeof handleAppointmentClick> = (args) => (
  <handleAppointmentClick {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
