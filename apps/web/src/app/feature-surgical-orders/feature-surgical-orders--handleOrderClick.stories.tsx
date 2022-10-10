import { ComponentStory, ComponentMeta } from '@storybook/react';
import { handleOrderClick } from './feature-surgical-orders';

export default {
  component: handleOrderClick,
  title: 'handleOrderClick',
} as ComponentMeta<typeof handleOrderClick>;

const Template: ComponentStory<typeof handleOrderClick> = (args) => (
  <handleOrderClick {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
