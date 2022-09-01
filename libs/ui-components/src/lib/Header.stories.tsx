import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Header } from './Header';

export default {
  component: Header,
  title: 'Header',
} as ComponentMeta<typeof Header>;

const Template: ComponentStory<typeof Header> = (args) => <Header {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
