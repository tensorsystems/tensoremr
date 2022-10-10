import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DiagnosisTable } from './DiagnosisAdminTable';

export default {
  component: DiagnosisTable,
  title: 'DiagnosisTable',
} as ComponentMeta<typeof DiagnosisTable>;

const Template: ComponentStory<typeof DiagnosisTable> = (args) => (
  <DiagnosisTable {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
