import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PatientReferralOrders } from './index';

export default {
  component: PatientReferralOrders,
  title: 'PatientReferralOrders',
} as ComponentMeta<typeof PatientReferralOrders>;

const Template: ComponentStory<typeof PatientReferralOrders> = (args) => (
  <PatientReferralOrders {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
