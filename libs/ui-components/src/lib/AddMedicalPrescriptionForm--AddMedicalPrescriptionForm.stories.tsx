import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AddMedicalPrescriptionForm } from './AddMedicalPrescriptionForm';

export default {
  component: AddMedicalPrescriptionForm,
  title: 'AddMedicalPrescriptionForm',
} as ComponentMeta<typeof AddMedicalPrescriptionForm>;

const Template: ComponentStory<typeof AddMedicalPrescriptionForm> = (args) => (
  <AddMedicalPrescriptionForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
