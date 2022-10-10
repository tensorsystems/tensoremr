import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PatientBasicInfo } from './PatientBasicInfo';

export default {
  component: PatientBasicInfo,
  title: 'PatientBasicInfo',
} as ComponentMeta<typeof PatientBasicInfo>;

const Template: ComponentStory<typeof PatientBasicInfo> = (args) => (
  <PatientBasicInfo {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
