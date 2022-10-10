import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UpdateDiagnosisForm } from './DiagnosisAdminTable';

export default {
  component: UpdateDiagnosisForm,
  title: 'UpdateDiagnosisForm',
} as ComponentMeta<typeof UpdateDiagnosisForm>;

const Template: ComponentStory<typeof UpdateDiagnosisForm> = (args) => (
  <UpdateDiagnosisForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
