import { ComponentStory, ComponentMeta } from '@storybook/react';
import CreateSlotForm from './CreateSlotForm';

const Story: ComponentMeta<typeof CreateSlotForm> = {
  component: CreateSlotForm,
  title: 'CreateSlotForm',
  argTypes: {
    onSuccess: { action: 'onSuccess executed!' },
    onCancel: { action: 'onCancel executed!' },
  },
};
export default Story;

const Template: ComponentStory<typeof CreateSlotForm> = (args) => (
  <CreateSlotForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  specialties: [],
  appointmentTypes: [],
  statuses: [],
};
