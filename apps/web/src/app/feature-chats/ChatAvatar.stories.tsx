import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ChatAvatar } from './ChatAvatar';

export default {
  component: ChatAvatar,
  title: 'ChatAvatar',
} as ComponentMeta<typeof ChatAvatar>;

const Template: ComponentStory<typeof ChatAvatar> = (args) => (
  <ChatAvatar {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
