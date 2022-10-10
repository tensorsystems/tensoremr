import { ComponentStory, ComponentMeta } from '@storybook/react';
import { HomeReception } from './feature-reception-home';

export default {
  component: HomeReception,
  title: 'HomeReception',
} as ComponentMeta<typeof HomeReception>;

const Template: ComponentStory<typeof HomeReception> = (args) => (
  <HomeReception {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
