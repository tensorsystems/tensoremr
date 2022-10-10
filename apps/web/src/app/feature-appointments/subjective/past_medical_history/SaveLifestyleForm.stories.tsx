import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SaveLifestyleForm } from './SaveLifestyleForm';

export default {
  component: SaveLifestyleForm,
  title: 'SaveLifestyleForm',
} as ComponentMeta<typeof SaveLifestyleForm>;

const Template: ComponentStory<typeof SaveLifestyleForm> = (args) => (
  <SaveLifestyleForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
