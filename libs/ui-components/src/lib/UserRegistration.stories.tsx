import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UserRegistrationPage } from './UserRegistration';

export default {
  component: UserRegistrationPage,
  title: 'UserRegistrationPage',
} as ComponentMeta<typeof UserRegistrationPage>;

const Template: ComponentStory<typeof UserRegistrationPage> = (args) => (
  <UserRegistrationPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
