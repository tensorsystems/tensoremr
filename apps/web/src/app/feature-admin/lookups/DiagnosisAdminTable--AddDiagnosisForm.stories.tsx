import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AddDiagnosisForm } from './DiagnosisAdminTable';

export default {
  component: AddDiagnosisForm,
  title: 'AddDiagnosisForm',
} as ComponentMeta<typeof AddDiagnosisForm>;

const Template: ComponentStory<typeof AddDiagnosisForm> = (args) => (
  <AddDiagnosisForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
