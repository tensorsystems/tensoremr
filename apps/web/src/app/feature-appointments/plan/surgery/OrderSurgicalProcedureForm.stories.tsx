import { ComponentStory, ComponentMeta } from '@storybook/react';
import { OrderSurgicalProcedureForm } from './OrderSurgicalProcedureForm';

export default {
  component: OrderSurgicalProcedureForm,
  title: 'OrderSurgicalProcedureForm',
} as ComponentMeta<typeof OrderSurgicalProcedureForm>;

const Template: ComponentStory<typeof OrderSurgicalProcedureForm> = (args) => (
  <OrderSurgicalProcedureForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
