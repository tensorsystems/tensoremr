import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PatientFollowUpOrders } from './index';

export default {
  component: PatientFollowUpOrders,
  title: 'PatientFollowUpOrders',
} as ComponentMeta<typeof PatientFollowUpOrders>;

const Template: ComponentStory<typeof PatientFollowUpOrders> = (args) => (
  <PatientFollowUpOrders {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
