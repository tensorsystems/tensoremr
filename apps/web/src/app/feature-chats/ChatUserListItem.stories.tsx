import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ChatUserListItem } from './ChatUserListItem';

export default {
  component: ChatUserListItem,
  title: 'ChatUserListItem',
} as ComponentMeta<typeof ChatUserListItem>;

const Template: ComponentStory<typeof ChatUserListItem> = (args) => (
  <ChatUserListItem {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
