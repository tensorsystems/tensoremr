import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ChatComponent } from './ChatComponent';

export default {
  component: ChatComponent,
  title: 'ChatComponent',
} as ComponentMeta<typeof ChatComponent>;

const Template: ComponentStory<typeof ChatComponent> = (args) => (
  <ChatComponent {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
