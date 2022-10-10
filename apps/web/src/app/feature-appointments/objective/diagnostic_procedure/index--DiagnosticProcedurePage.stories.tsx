import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DiagnosticProcedurePage } from './index';

export default {
  component: DiagnosticProcedurePage,
  title: 'DiagnosticProcedurePage',
} as ComponentMeta<typeof DiagnosticProcedurePage>;

const Template: ComponentStory<typeof DiagnosticProcedurePage> = (args) => (
  <DiagnosticProcedurePage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
