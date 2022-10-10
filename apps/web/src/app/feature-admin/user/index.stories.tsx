import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UserAdminPage } from './index';

export default {
  component: UserAdminPage,
  title: 'UserAdminPage',
} as ComponentMeta<typeof UserAdminPage>;

const Template: ComponentStory<typeof UserAdminPage> = (args) => (
  <UserAdminPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
