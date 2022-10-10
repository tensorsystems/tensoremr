import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UserTypesTable } from './UserTypeAdminTable';

export default {
  component: UserTypesTable,
  title: 'UserTypesTable',
} as ComponentMeta<typeof UserTypesTable>;

const Template: ComponentStory<typeof UserTypesTable> = (args) => (
  <UserTypesTable {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
