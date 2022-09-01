import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PatientRegistrationDocumentsForm } from './PatientRegistrationDocumentsForm';

export default {
  component: PatientRegistrationDocumentsForm,
  title: 'PatientRegistrationDocumentsForm',
} as ComponentMeta<typeof PatientRegistrationDocumentsForm>;

const Template: ComponentStory<typeof PatientRegistrationDocumentsForm> = (
  args
) => <PatientRegistrationDocumentsForm {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
