import { ComponentStory, ComponentMeta } from '@storybook/react';
import { NavItem } from './NavItem';

export default {
  component: NavItem,
  title: 'NavItem',
} as ComponentMeta<typeof NavItem>;

const Template: ComponentStory<typeof NavItem> = (args) => (
  <NavItem {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
