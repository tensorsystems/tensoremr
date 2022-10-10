import { ComponentStory, ComponentMeta } from '@storybook/react';
import { handleRequestClick } from './index';

export default {
  component: handleRequestClick,
  title: 'handleRequestClick',
} as ComponentMeta<typeof handleRequestClick>;

const Template: ComponentStory<typeof handleRequestClick> = (args) => (
  <handleRequestClick {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
