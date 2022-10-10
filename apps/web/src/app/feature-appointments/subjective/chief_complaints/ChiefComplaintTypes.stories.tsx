import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ChiefComplaintTypes } from './ChiefComplaintTypes';

export default {
  component: ChiefComplaintTypes,
  title: 'ChiefComplaintTypes',
} as ComponentMeta<typeof ChiefComplaintTypes>;

const Template: ComponentStory<typeof ChiefComplaintTypes> = (args) => (
  <ChiefComplaintTypes {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
