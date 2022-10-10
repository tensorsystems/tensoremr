import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UpdateFamilyIllnessForm } from './UpdateFamilyIllnessForm';

export default {
  component: UpdateFamilyIllnessForm,
  title: 'UpdateFamilyIllnessForm',
} as ComponentMeta<typeof UpdateFamilyIllnessForm>;

const Template: ComponentStory<typeof UpdateFamilyIllnessForm> = (args) => (
  <UpdateFamilyIllnessForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
