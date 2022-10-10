import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AddPastIllnessTypeForm } from './PastIllnessTypeAdminTable';

export default {
  component: AddPastIllnessTypeForm,
  title: 'AddPastIllnessTypeForm',
} as ComponentMeta<typeof AddPastIllnessTypeForm>;

const Template: ComponentStory<typeof AddPastIllnessTypeForm> = (args) => (
  <AddPastIllnessTypeForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
