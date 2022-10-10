import { ComponentStory, ComponentMeta } from '@storybook/react';
import { OrderFollowUpForm } from './OrderFollowUpForm';

export default {
  component: OrderFollowUpForm,
  title: 'OrderFollowUpForm',
} as ComponentMeta<typeof OrderFollowUpForm>;

const Template: ComponentStory<typeof OrderFollowUpForm> = (args) => (
  <OrderFollowUpForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
