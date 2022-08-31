import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AppointmentFormContainer } from './AppointmentFormContainer';

export default {
  component: AppointmentFormContainer,
  title: 'AppointmentFormContainer',
} as ComponentMeta<typeof AppointmentFormContainer>;

const Template: ComponentStory<typeof AppointmentFormContainer> = (args) => (
  <AppointmentFormContainer {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
