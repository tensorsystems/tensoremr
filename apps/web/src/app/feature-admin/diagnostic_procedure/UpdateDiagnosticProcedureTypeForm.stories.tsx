import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UpdateDiagnosticProcedureTypeForm } from './UpdateDiagnosticProcedureTypeForm';

export default {
  component: UpdateDiagnosticProcedureTypeForm,
  title: 'UpdateDiagnosticProcedureTypeForm',
} as ComponentMeta<typeof UpdateDiagnosticProcedureTypeForm>;

const Template: ComponentStory<typeof UpdateDiagnosticProcedureTypeForm> = (
  args
) => <UpdateDiagnosticProcedureTypeForm {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
