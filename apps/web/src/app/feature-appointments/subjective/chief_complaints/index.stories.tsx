import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ChiefComplaints } from './index';

export default {
  component: ChiefComplaints,
  title: 'ChiefComplaints',
} as ComponentMeta<typeof ChiefComplaints>;

const Template: ComponentStory<typeof ChiefComplaints> = (args) => (
  <ChiefComplaints {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
