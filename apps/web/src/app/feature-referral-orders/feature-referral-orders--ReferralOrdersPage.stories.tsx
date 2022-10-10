import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ReferralOrdersPage } from './feature-referral-orders';

export default {
  component: ReferralOrdersPage,
  title: 'ReferralOrdersPage',
} as ComponentMeta<typeof ReferralOrdersPage>;

const Template: ComponentStory<typeof ReferralOrdersPage> = (args) => (
  <ReferralOrdersPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
