import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ReferralPage } from './index';

export default {
  component: ReferralPage,
  title: 'ReferralPage',
} as ComponentMeta<typeof ReferralPage>;

const Template: ComponentStory<typeof ReferralPage> = (args) => (
  <ReferralPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
