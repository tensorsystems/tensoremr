import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SaveFamilyIllnessForm } from './SaveFamilyIllnessForm';

export default {
  component: SaveFamilyIllnessForm,
  title: 'SaveFamilyIllnessForm',
} as ComponentMeta<typeof SaveFamilyIllnessForm>;

const Template: ComponentStory<typeof SaveFamilyIllnessForm> = (args) => (
  <SaveFamilyIllnessForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
