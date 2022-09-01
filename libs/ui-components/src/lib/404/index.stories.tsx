import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Component404 } from './index';

export default {
  component: Component404,
  title: 'Component404',
} as ComponentMeta<typeof Component404>;

const Template: ComponentStory<typeof Component404> = (args) => (
  <Component404 {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
