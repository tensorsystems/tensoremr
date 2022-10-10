import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DifferentialDiagnosisPage } from './index';

export default {
  component: DifferentialDiagnosisPage,
  title: 'DifferentialDiagnosisPage',
} as ComponentMeta<typeof DifferentialDiagnosisPage>;

const Template: ComponentStory<typeof DifferentialDiagnosisPage> = (args) => (
  <DifferentialDiagnosisPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
