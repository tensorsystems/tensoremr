import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DiagnosticProcedureTypePage } from './index';

export default {
  component: DiagnosticProcedureTypePage,
  title: 'DiagnosticProcedureTypePage',
} as ComponentMeta<typeof DiagnosticProcedureTypePage>;

const Template: ComponentStory<typeof DiagnosticProcedureTypePage> = (args) => (
  <DiagnosticProcedureTypePage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
