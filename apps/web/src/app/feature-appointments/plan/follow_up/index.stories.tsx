import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FollowUpPage } from './index';

export default {
  component: FollowUpPage,
  title: 'FollowUpPage',
} as ComponentMeta<typeof FollowUpPage>;

const Template: ComponentStory<typeof FollowUpPage> = (args) => (
  <FollowUpPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
