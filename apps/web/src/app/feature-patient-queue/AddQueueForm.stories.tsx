import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AddQueueForm } from './AddQueueForm';

export default {
  component: AddQueueForm,
  title: 'AddQueueForm',
} as ComponentMeta<typeof AddQueueForm>;

const Template: ComponentStory<typeof AddQueueForm> = (args) => (
  <AddQueueForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
