import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ChatsPage } from './feature-chats';

export default {
  component: ChatsPage,
  title: 'ChatsPage',
} as ComponentMeta<typeof ChatsPage>;

const Template: ComponentStory<typeof ChatsPage> = (args) => (
  <ChatsPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
