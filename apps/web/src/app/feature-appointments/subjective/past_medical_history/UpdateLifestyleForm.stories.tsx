import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UpdateLifestyleForm } from './UpdateLifestyleForm';

export default {
  component: UpdateLifestyleForm,
  title: 'UpdateLifestyleForm',
} as ComponentMeta<typeof UpdateLifestyleForm>;

const Template: ComponentStory<typeof UpdateLifestyleForm> = (args) => (
  <UpdateLifestyleForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
