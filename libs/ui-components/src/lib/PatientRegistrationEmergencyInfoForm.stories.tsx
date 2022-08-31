import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PatientRegistrationEmergencyInfoForm } from './PatientRegistrationEmergencyInfoForm';

export default {
  component: PatientRegistrationEmergencyInfoForm,
  title: 'PatientRegistrationEmergencyInfoForm',
} as ComponentMeta<typeof PatientRegistrationEmergencyInfoForm>;

const Template: ComponentStory<typeof PatientRegistrationEmergencyInfoForm> = (
  args
) => <PatientRegistrationEmergencyInfoForm {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
