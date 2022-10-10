import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MessageBody } from './MessageBody';

export default {
  component: MessageBody,
  title: 'MessageBody',
} as ComponentMeta<typeof MessageBody>;

const Template: ComponentStory<typeof MessageBody> = (args) => (
  <MessageBody {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
