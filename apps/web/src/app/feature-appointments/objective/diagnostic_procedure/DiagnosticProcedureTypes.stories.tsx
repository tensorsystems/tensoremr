import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DiagnosticProcedureTypes } from './DiagnosticProcedureTypes';

export default {
  component: DiagnosticProcedureTypes,
  title: 'DiagnosticProcedureTypes',
} as ComponentMeta<typeof DiagnosticProcedureTypes>;

const Template: ComponentStory<typeof DiagnosticProcedureTypes> = (args) => (
  <DiagnosticProcedureTypes {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
