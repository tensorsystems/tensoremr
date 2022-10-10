import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UpdateMedicalPrescriptionForm } from './UpdateMedicationForm';

export default {
  component: UpdateMedicalPrescriptionForm,
  title: 'UpdateMedicalPrescriptionForm',
} as ComponentMeta<typeof UpdateMedicalPrescriptionForm>;

const Template: ComponentStory<typeof UpdateMedicalPrescriptionForm> = (
  args
) => <UpdateMedicalPrescriptionForm {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
