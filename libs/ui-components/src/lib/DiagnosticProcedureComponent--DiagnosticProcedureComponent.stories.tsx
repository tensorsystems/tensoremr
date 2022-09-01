import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DiagnosticProcedureComponent } from './DiagnosticProcedureComponent';

export default {
  component: DiagnosticProcedureComponent,
  title: 'DiagnosticProcedureComponent',
} as ComponentMeta<typeof DiagnosticProcedureComponent>;

const Template: ComponentStory<typeof DiagnosticProcedureComponent> = (
  args
) => <DiagnosticProcedureComponent {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
