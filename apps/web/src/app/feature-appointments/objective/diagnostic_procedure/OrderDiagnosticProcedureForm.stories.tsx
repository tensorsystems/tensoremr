import { ComponentStory, ComponentMeta } from '@storybook/react';
import { OrderDiagnosticProcedureForm } from './OrderDiagnosticProcedureForm';

export default {
  component: OrderDiagnosticProcedureForm,
  title: 'OrderDiagnosticProcedureForm',
} as ComponentMeta<typeof OrderDiagnosticProcedureForm>;

const Template: ComponentStory<typeof OrderDiagnosticProcedureForm> = (
  args
) => <OrderDiagnosticProcedureForm {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
