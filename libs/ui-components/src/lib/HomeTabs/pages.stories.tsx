import { ComponentStory, ComponentMeta } from '@storybook/react';
import { HomePages } from './pages';

export default {
  component: HomePages,
  title: 'HomePages',
} as ComponentMeta<typeof HomePages>;

const Template: ComponentStory<typeof HomePages> = (args) => (
  <HomePages {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
