import { ComponentStory, ComponentMeta } from '@storybook/react';
import { OrderForm } from './index';

export default {
  component: OrderForm,
  title: 'OrderForm',
} as ComponentMeta<typeof OrderForm>;

const Template: ComponentStory<typeof OrderForm> = (args) => (
  <OrderForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
