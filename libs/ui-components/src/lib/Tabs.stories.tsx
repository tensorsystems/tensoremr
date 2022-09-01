import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Tabs } from './Tabs';

export default {
  component: Tabs,
  title: 'Tabs',
} as ComponentMeta<typeof Tabs>;

const Template: ComponentStory<typeof Tabs> = (args) => <Tabs {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
