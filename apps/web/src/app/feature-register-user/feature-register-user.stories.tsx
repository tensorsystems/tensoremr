import { ComponentStory, ComponentMeta } from '@storybook/react';
import { RegisterPage } from './feature-register-user';

export default {
  component: RegisterPage,
  title: 'RegisterPage',
} as ComponentMeta<typeof RegisterPage>;

const Template: ComponentStory<typeof RegisterPage> = (args) => (
  <RegisterPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
