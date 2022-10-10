import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AddToQueueForm } from './AddToQueueForm';

export default {
  component: AddToQueueForm,
  title: 'AddToQueueForm',
} as ComponentMeta<typeof AddToQueueForm>;

const Template: ComponentStory<typeof AddToQueueForm> = (args) => (
  <AddToQueueForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
