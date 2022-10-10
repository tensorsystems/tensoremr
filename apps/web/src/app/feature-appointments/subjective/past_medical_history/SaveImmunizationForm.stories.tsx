import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SaveImmunizationForm } from './SaveImmunizationForm';

export default {
  component: SaveImmunizationForm,
  title: 'SaveImmunizationForm',
} as ComponentMeta<typeof SaveImmunizationForm>;

const Template: ComponentStory<typeof SaveImmunizationForm> = (args) => (
  <SaveImmunizationForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
