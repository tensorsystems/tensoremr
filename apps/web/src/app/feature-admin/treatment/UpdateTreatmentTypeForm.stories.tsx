import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UpdateTreatmentTypeForm } from './UpdateTreatmentTypeForm';

export default {
  component: UpdateTreatmentTypeForm,
  title: 'UpdateTreatmentTypeForm',
} as ComponentMeta<typeof UpdateTreatmentTypeForm>;

const Template: ComponentStory<typeof UpdateTreatmentTypeForm> = (args) => (
  <UpdateTreatmentTypeForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
