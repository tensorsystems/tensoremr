import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SaveMentalStateForm } from './SaveMentalStateForm';

export default {
  component: SaveMentalStateForm,
  title: 'SaveMentalStateForm',
} as ComponentMeta<typeof SaveMentalStateForm>;

const Template: ComponentStory<typeof SaveMentalStateForm> = (args) => (
  <SaveMentalStateForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
