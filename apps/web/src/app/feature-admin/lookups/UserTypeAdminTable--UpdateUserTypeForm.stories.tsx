import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UpdateUserTypeForm } from './UserTypeAdminTable';

export default {
  component: UpdateUserTypeForm,
  title: 'UpdateUserTypeForm',
} as ComponentMeta<typeof UpdateUserTypeForm>;

const Template: ComponentStory<typeof UpdateUserTypeForm> = (args) => (
  <UpdateUserTypeForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
