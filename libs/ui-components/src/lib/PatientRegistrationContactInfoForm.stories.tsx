import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PatientRegistrationContactInfoForm } from './PatientRegistrationContactInfoForm';

export default {
  component: PatientRegistrationContactInfoForm,
  title: 'PatientRegistrationContactInfoForm',
} as ComponentMeta<typeof PatientRegistrationContactInfoForm>;

const Template: ComponentStory<typeof PatientRegistrationContactInfoForm> = (
  args
) => <PatientRegistrationContactInfoForm {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
