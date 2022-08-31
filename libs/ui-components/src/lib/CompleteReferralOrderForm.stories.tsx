import { ComponentStory, ComponentMeta } from '@storybook/react';
import { CompleteReferralOrderForm } from './CompleteReferralOrderForm';

export default {
  component: CompleteReferralOrderForm,
  title: 'CompleteReferralOrderForm',
} as ComponentMeta<typeof CompleteReferralOrderForm>;

const Template: ComponentStory<typeof CompleteReferralOrderForm> = (args) => (
  <CompleteReferralOrderForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
