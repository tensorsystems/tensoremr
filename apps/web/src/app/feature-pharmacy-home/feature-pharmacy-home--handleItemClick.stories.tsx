import { ComponentStory, ComponentMeta } from '@storybook/react';
import { handleItemClick } from './feature-pharmacy-home';

export default {
  component: handleItemClick,
  title: 'handleItemClick',
} as ComponentMeta<typeof handleItemClick>;

const Template: ComponentStory<typeof handleItemClick> = (args) => (
  <handleItemClick {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
