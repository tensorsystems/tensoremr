import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PatientRegistrationDemographicForm } from './PatientRegistrationDemographicForm';

export default {
  component: PatientRegistrationDemographicForm,
  title: 'PatientRegistrationDemographicForm',
} as ComponentMeta<typeof PatientRegistrationDemographicForm>;

const Template: ComponentStory<typeof PatientRegistrationDemographicForm> = (
  args
) => <PatientRegistrationDemographicForm {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
