import { ComponentStory, ComponentMeta } from '@storybook/react';
import { page } from './index';

export default {
  component: page,
  title: 'page',
} as ComponentMeta<typeof page>;

const Template: ComponentStory<typeof page> = (args) => <page {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
