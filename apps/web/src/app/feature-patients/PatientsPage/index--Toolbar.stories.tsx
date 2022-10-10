import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Toolbar } from './index';

export default {
  component: Toolbar,
  title: 'Toolbar',
} as ComponentMeta<typeof Toolbar>;

const Template: ComponentStory<typeof Toolbar> = (args) => (
  <Toolbar {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
