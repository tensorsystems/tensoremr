import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AddDiagnosticProcedureTypeForm } from './AddDiagnosticProcedureTypeForm';

export default {
  component: AddDiagnosticProcedureTypeForm,
  title: 'AddDiagnosticProcedureTypeForm',
} as ComponentMeta<typeof AddDiagnosticProcedureTypeForm>;

const Template: ComponentStory<typeof AddDiagnosticProcedureTypeForm> = (
  args
) => <AddDiagnosticProcedureTypeForm {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
