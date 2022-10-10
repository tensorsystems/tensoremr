import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AdminHome } from './feature-admin';

export default {
  component: AdminHome,
  title: 'AdminHome',
} as ComponentMeta<typeof AdminHome>;

const Template: ComponentStory<typeof AdminHome> = (args) => (
  <AdminHome {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
