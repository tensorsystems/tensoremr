import { ComponentStory, ComponentMeta } from '@storybook/react';
import { OrderReferralForm } from './OrderReferralForm';

export default {
  component: OrderReferralForm,
  title: 'OrderReferralForm',
} as ComponentMeta<typeof OrderReferralForm>;

const Template: ComponentStory<typeof OrderReferralForm> = (args) => (
  <OrderReferralForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
