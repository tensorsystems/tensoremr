import { ComponentStory, ComponentMeta } from '@storybook/react';
import { CompleteLabOrderForm } from './CompleteLabOrderForm';

export default {
  component: CompleteLabOrderForm,
  title: 'CompleteLabOrderForm',
} as ComponentMeta<typeof CompleteLabOrderForm>;

const Template: ComponentStory<typeof CompleteLabOrderForm> = (args) => (
  <CompleteLabOrderForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
