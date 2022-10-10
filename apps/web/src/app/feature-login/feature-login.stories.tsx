import { ComponentStory, ComponentMeta } from '@storybook/react';
import { LoginPage } from './feature-login';

export default {
  component: LoginPage,
  title: 'LoginPage',
} as ComponentMeta<typeof LoginPage>;

const Template: ComponentStory<typeof LoginPage> = (args) => (
  <LoginPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
