import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ChatListItem } from './ChatListItem';

export default {
  component: ChatListItem,
  title: 'ChatListItem',
} as ComponentMeta<typeof ChatListItem>;

const Template: ComponentStory<typeof ChatListItem> = (args) => (
  <ChatListItem {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
