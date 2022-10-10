import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ProtectedRoute } from './ProtectedLayout';

export default {
  component: ProtectedRoute,
  title: 'ProtectedRoute',
} as ComponentMeta<typeof ProtectedRoute>;

const Template: ComponentStory<typeof ProtectedRoute> = (args) => (
  <ProtectedRoute {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
