import { ComponentStory, ComponentMeta } from '@storybook/react';
import { CheckInForm } from './CheckInForm';

export default {
  component: CheckInForm,
  title: 'CheckInForm',
} as ComponentMeta<typeof CheckInForm>;

const Template: ComponentStory<typeof CheckInForm> = (args) => (
  <CheckInForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
