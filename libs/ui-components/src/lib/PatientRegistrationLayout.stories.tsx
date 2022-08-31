import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PatientRegistrationLayout } from './PatientRegistrationLayout';

export default {
  component: PatientRegistrationLayout,
  title: 'PatientRegistrationLayout',
} as ComponentMeta<typeof PatientRegistrationLayout>;

const Template: ComponentStory<typeof PatientRegistrationLayout> = (args) => (
  <PatientRegistrationLayout {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
