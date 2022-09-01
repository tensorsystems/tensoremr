import { ComponentStory, ComponentMeta } from '@storybook/react';
import { CompleteDiagnosticOrderForm } from './CompleteDiagnosticOrderForm';

export default {
  component: CompleteDiagnosticOrderForm,
  title: 'CompleteDiagnosticOrderForm',
} as ComponentMeta<typeof CompleteDiagnosticOrderForm>;

const Template: ComponentStory<typeof CompleteDiagnosticOrderForm> = (args) => (
  <CompleteDiagnosticOrderForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
