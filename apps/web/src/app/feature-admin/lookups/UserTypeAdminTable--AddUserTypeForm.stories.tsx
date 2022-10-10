import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AddUserTypeForm } from './UserTypeAdminTable';

export default {
  component: AddUserTypeForm,
  title: 'AddUserTypeForm',
} as ComponentMeta<typeof AddUserTypeForm>;

const Template: ComponentStory<typeof AddUserTypeForm> = (args) => (
  <AddUserTypeForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
