import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DiagnosticOrdersTable } from './DiagnosticOrdersTable';

export default {
  component: DiagnosticOrdersTable,
  title: 'DiagnosticOrdersTable',
} as ComponentMeta<typeof DiagnosticOrdersTable>;

const Template: ComponentStory<typeof DiagnosticOrdersTable> = (args) => (
  <DiagnosticOrdersTable {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
