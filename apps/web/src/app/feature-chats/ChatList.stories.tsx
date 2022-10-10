import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ChatList } from './ChatList';

export default {
  component: ChatList,
  title: 'ChatList',
} as ComponentMeta<typeof ChatList>;

const Template: ComponentStory<typeof ChatList> = (args) => (
  <ChatList {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
