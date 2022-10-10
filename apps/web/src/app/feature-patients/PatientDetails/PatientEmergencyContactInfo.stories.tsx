import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PatientEmergencyContactInfo } from './PatientEmergencyContactInfo';

export default {
  component: PatientEmergencyContactInfo,
  title: 'PatientEmergencyContactInfo',
} as ComponentMeta<typeof PatientEmergencyContactInfo>;

const Template: ComponentStory<typeof PatientEmergencyContactInfo> = (args) => (
  <PatientEmergencyContactInfo {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
