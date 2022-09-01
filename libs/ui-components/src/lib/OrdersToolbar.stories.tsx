import { ComponentStory, ComponentMeta } from '@storybook/react';
import { OrdersToolbar } from './OrdersToolbar';

export default {
  component: OrdersToolbar,
  title: 'OrdersToolbar',
} as ComponentMeta<typeof OrdersToolbar>;

const Template: ComponentStory<typeof OrdersToolbar> = (args) => (
  <OrdersToolbar {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
