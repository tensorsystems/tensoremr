import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UpdatePastSurgeryForm } from './UpdatePastSurgeryForm';

export default {
  component: UpdatePastSurgeryForm,
  title: 'UpdatePastSurgeryForm',
} as ComponentMeta<typeof UpdatePastSurgeryForm>;

const Template: ComponentStory<typeof UpdatePastSurgeryForm> = (args) => (
  <UpdatePastSurgeryForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
