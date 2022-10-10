import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ChiefComplaintHpi } from './ChiefComplaintHpi';

export default {
  component: ChiefComplaintHpi,
  title: 'ChiefComplaintHpi',
} as ComponentMeta<typeof ChiefComplaintHpi>;

const Template: ComponentStory<typeof ChiefComplaintHpi> = (args) => (
  <ChiefComplaintHpi {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
