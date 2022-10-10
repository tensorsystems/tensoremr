import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ProfilePage } from './feature-profile';

export default {
  component: ProfilePage,
  title: 'ProfilePage',
} as ComponentMeta<typeof ProfilePage>;

const Template: ComponentStory<typeof ProfilePage> = (args) => (
  <ProfilePage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
