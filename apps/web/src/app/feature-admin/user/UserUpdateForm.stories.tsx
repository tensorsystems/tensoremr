import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UserUpdateForm } from './UserUpdateForm';

export default {
  component: UserUpdateForm,
  title: 'UserUpdateForm',
} as ComponentMeta<typeof UserUpdateForm>;

const Template: ComponentStory<typeof UserUpdateForm> = (args) => (
  <UserUpdateForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
