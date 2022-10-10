import { ComponentStory, ComponentMeta } from '@storybook/react';
import { NewChatDialog } from './NewChatDialog';

export default {
  component: NewChatDialog,
  title: 'NewChatDialog',
} as ComponentMeta<typeof NewChatDialog>;

const Template: ComponentStory<typeof NewChatDialog> = (args) => (
  <NewChatDialog {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
