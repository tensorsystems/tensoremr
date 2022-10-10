import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AddTreatmentTypeForm } from './AddTreatmentTypeForm';

export default {
  component: AddTreatmentTypeForm,
  title: 'AddTreatmentTypeForm',
} as ComponentMeta<typeof AddTreatmentTypeForm>;

const Template: ComponentStory<typeof AddTreatmentTypeForm> = (args) => (
  <AddTreatmentTypeForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
