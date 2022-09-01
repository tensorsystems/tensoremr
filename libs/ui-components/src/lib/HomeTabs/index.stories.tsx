import { ComponentStory, ComponentMeta } from '@storybook/react';
import { HomeTabs } from './index';

export default {
  component: HomeTabs,
  title: 'HomeTabs',
} as ComponentMeta<typeof HomeTabs>;

const Template: ComponentStory<typeof HomeTabs> = (args) => (
  <HomeTabs {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
