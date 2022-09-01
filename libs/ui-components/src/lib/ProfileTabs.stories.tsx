import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ProfileTabs } from './ProfileTabs';

export default {
  component: ProfileTabs,
  title: 'ProfileTabs',
} as ComponentMeta<typeof ProfileTabs>;

const Template: ComponentStory<typeof ProfileTabs> = (args) => (
  <ProfileTabs {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
