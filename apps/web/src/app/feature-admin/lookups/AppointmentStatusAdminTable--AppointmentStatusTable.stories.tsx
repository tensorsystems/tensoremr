import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AppointmentStatusTable } from './AppointmentStatusAdminTable';

export default {
  component: AppointmentStatusTable,
  title: 'AppointmentStatusTable',
} as ComponentMeta<typeof AppointmentStatusTable>;

const Template: ComponentStory<typeof AppointmentStatusTable> = (args) => (
  <AppointmentStatusTable {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
