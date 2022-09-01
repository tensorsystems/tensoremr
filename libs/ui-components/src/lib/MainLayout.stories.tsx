import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MainLayout } from './MainLayout';

export default {
  component: MainLayout,
  title: 'MainLayout',
} as ComponentMeta<typeof MainLayout>;

const Template: ComponentStory<typeof MainLayout> = (args) => (
  <MainLayout {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
