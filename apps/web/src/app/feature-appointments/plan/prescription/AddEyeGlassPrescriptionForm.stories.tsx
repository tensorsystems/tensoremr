import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AddEyeGlassPrescriptionForm } from './AddEyeGlassPrescriptionForm';

export default {
  component: AddEyeGlassPrescriptionForm,
  title: 'AddEyeGlassPrescriptionForm',
} as ComponentMeta<typeof AddEyeGlassPrescriptionForm>;

const Template: ComponentStory<typeof AddEyeGlassPrescriptionForm> = (args) => (
  <AddEyeGlassPrescriptionForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
