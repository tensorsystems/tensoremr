import { ComponentStory, ComponentMeta } from '@storybook/react';
import { OrderLabForm } from './OrderLabForm';

export default {
  component: OrderLabForm,
  title: 'OrderLabForm',
} as ComponentMeta<typeof OrderLabForm>;

const Template: ComponentStory<typeof OrderLabForm> = (args) => (
  <OrderLabForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
