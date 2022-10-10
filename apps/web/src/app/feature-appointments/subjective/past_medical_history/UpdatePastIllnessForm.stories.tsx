import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UpdatePastIllnessForm } from './UpdatePastIllnessForm';

export default {
  component: UpdatePastIllnessForm,
  title: 'UpdatePastIllnessForm',
} as ComponentMeta<typeof UpdatePastIllnessForm>;

const Template: ComponentStory<typeof UpdatePastIllnessForm> = (args) => (
  <UpdatePastIllnessForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
