import { ComponentStory, ComponentMeta } from '@storybook/react';
import { TreatmentForm } from './TreatmentForm';

export default {
  component: TreatmentForm,
  title: 'TreatmentForm',
} as ComponentMeta<typeof TreatmentForm>;

const Template: ComponentStory<typeof TreatmentForm> = (args) => (
  <TreatmentForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
