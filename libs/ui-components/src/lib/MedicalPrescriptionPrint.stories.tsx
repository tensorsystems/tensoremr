import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MedicalPrescriptionPrint } from './MedicalPrescriptionPrint';

export default {
  component: MedicalPrescriptionPrint,
  title: 'MedicalPrescriptionPrint',
} as ComponentMeta<typeof MedicalPrescriptionPrint>;

const Template: ComponentStory<typeof MedicalPrescriptionPrint> = (args) => (
  <MedicalPrescriptionPrint {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
