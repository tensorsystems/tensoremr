import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UpdatePastIllnessTypeForm } from './PastIllnessTypeAdminTable';

export default {
  component: UpdatePastIllnessTypeForm,
  title: 'UpdatePastIllnessTypeForm',
} as ComponentMeta<typeof UpdatePastIllnessTypeForm>;

const Template: ComponentStory<typeof UpdatePastIllnessTypeForm> = (args) => (
  <UpdatePastIllnessTypeForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
