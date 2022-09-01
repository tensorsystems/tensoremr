import { ComponentStory, ComponentMeta } from '@storybook/react';
import { handleProviderClick } from './SearchBar';

export default {
  component: handleProviderClick,
  title: 'handleProviderClick',
} as ComponentMeta<typeof handleProviderClick>;

const Template: ComponentStory<typeof handleProviderClick> = (args) => (
  <handleProviderClick {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
