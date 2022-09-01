import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UserRegistrationForm } from './UserRegistrationForm';

export default {
  component: UserRegistrationForm,
  title: 'UserRegistrationForm',
} as ComponentMeta<typeof UserRegistrationForm>;

const Template: ComponentStory<typeof UserRegistrationForm> = (args) => (
  <UserRegistrationForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
