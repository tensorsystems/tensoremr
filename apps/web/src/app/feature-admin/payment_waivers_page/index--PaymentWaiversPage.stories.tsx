import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PaymentWaiversPage } from './index';

export default {
  component: PaymentWaiversPage,
  title: 'PaymentWaiversPage',
} as ComponentMeta<typeof PaymentWaiversPage>;

const Template: ComponentStory<typeof PaymentWaiversPage> = (args) => (
  <PaymentWaiversPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
