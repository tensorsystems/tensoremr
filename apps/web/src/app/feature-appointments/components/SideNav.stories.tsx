import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SideNav } from './SideNav';

export default {
  component: SideNav,
  title: 'SideNav',
} as ComponentMeta<typeof SideNav>;

const Template: ComponentStory<typeof SideNav> = (args) => (
  <SideNav {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
