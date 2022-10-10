import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SavePastDisorderForm } from './SavePastDisorderForm';

export default {
  component: SavePastDisorderForm,
  title: 'SavePastDisorderForm',
} as ComponentMeta<typeof SavePastDisorderForm>;

const Template: ComponentStory<typeof SavePastDisorderForm> = (args) => (
  <SavePastDisorderForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
