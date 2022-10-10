import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UpdateEyewearPrescriptionForm } from './UpdateEyeGlassPrescriptionForm';

export default {
  component: UpdateEyewearPrescriptionForm,
  title: 'UpdateEyewearPrescriptionForm',
} as ComponentMeta<typeof UpdateEyewearPrescriptionForm>;

const Template: ComponentStory<typeof UpdateEyewearPrescriptionForm> = (
  args
) => <UpdateEyewearPrescriptionForm {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
