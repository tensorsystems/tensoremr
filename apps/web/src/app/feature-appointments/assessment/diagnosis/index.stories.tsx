import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DiagnosisPage } from './index';

export default {
  component: DiagnosisPage,
  title: 'DiagnosisPage',
} as ComponentMeta<typeof DiagnosisPage>;

const Template: ComponentStory<typeof DiagnosisPage> = (args) => (
  <DiagnosisPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
