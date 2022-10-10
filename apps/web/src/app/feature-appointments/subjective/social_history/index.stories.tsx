import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SocialHistoryPage } from './index';

export default {
  component: SocialHistoryPage,
  title: 'SocialHistoryPage',
} as ComponentMeta<typeof SocialHistoryPage>;

const Template: ComponentStory<typeof SocialHistoryPage> = (args) => (
  <SocialHistoryPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
