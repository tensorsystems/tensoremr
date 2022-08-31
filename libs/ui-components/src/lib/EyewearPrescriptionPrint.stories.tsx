import { ComponentStory, ComponentMeta } from '@storybook/react';
import { EyewearPrescriptionPrint } from './EyewearPrescriptionPrint';

export default {
  component: EyewearPrescriptionPrint,
  title: 'EyewearPrescriptionPrint',
} as ComponentMeta<typeof EyewearPrescriptionPrint>;

const Template: ComponentStory<typeof EyewearPrescriptionPrint> = (args) => (
  <EyewearPrescriptionPrint {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
