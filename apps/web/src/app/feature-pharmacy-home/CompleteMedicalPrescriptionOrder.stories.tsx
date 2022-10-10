import { ComponentStory, ComponentMeta } from '@storybook/react';
import { CompleteMedicalPrescriptionOrder } from './CompleteMedicalPrescriptionOrder';

export default {
  component: CompleteMedicalPrescriptionOrder,
  title: 'CompleteMedicalPrescriptionOrder',
} as ComponentMeta<typeof CompleteMedicalPrescriptionOrder>;

const Template: ComponentStory<typeof CompleteMedicalPrescriptionOrder> = (
  args
) => <CompleteMedicalPrescriptionOrder {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
