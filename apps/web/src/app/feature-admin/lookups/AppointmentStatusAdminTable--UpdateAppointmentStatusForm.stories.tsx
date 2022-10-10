import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UpdateAppointmentStatusForm } from './AppointmentStatusAdminTable';

export default {
  component: UpdateAppointmentStatusForm,
  title: 'UpdateAppointmentStatusForm',
} as ComponentMeta<typeof UpdateAppointmentStatusForm>;

const Template: ComponentStory<typeof UpdateAppointmentStatusForm> = (args) => (
  <UpdateAppointmentStatusForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
