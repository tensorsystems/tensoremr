import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PatientRegistrationPage } from './feature-patient-registration';

export default {
  component: PatientRegistrationPage,
  title: 'PatientRegistrationPage',
} as ComponentMeta<typeof PatientRegistrationPage>;

const Template: ComponentStory<typeof PatientRegistrationPage> = (args) => (
  <PatientRegistrationPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
