import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ChatBubble } from './ChatBubble';

export default {
  component: ChatBubble,
  title: 'ChatBubble',
} as ComponentMeta<typeof ChatBubble>;

const Template: ComponentStory<typeof ChatBubble> = (args) => (
  <ChatBubble {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
