import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SaveAppointmentStatusForm } from './AppointmentStatusAdminTable';

export default {
  component: SaveAppointmentStatusForm,
  title: 'SaveAppointmentStatusForm',
} as ComponentMeta<typeof SaveAppointmentStatusForm>;

const Template: ComponentStory<typeof SaveAppointmentStatusForm> = (args) => (
  <SaveAppointmentStatusForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
