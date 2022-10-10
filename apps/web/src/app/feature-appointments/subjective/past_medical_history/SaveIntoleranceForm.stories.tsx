import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SaveIntoleranceForm } from './SaveIntoleranceForm';

export default {
  component: SaveIntoleranceForm,
  title: 'SaveIntoleranceForm',
} as ComponentMeta<typeof SaveIntoleranceForm>;

const Template: ComponentStory<typeof SaveIntoleranceForm> = (args) => (
  <SaveIntoleranceForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
