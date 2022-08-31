import { ComponentStory, ComponentMeta } from '@storybook/react';
import { CompleteFollowUpOrderForm } from './CompleteFollowUpOrderForm';

export default {
  component: CompleteFollowUpOrderForm,
  title: 'CompleteFollowUpOrderForm',
} as ComponentMeta<typeof CompleteFollowUpOrderForm>;

const Template: ComponentStory<typeof CompleteFollowUpOrderForm> = (args) => (
  <CompleteFollowUpOrderForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
