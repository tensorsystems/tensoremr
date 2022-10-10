import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SideNav } from './feature-admin';

export default {
  component: SideNav,
  title: 'SideNav',
} as ComponentMeta<typeof SideNav>;

const Template: ComponentStory<typeof SideNav> = (args) => (
  <SideNav {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
