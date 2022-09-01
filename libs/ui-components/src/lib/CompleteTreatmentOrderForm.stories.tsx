import { ComponentStory, ComponentMeta } from '@storybook/react';
import { CompleteTreatmentOrderForm } from './CompleteTreatmentOrderForm';

export default {
  component: CompleteTreatmentOrderForm,
  title: 'CompleteTreatmentOrderForm',
} as ComponentMeta<typeof CompleteTreatmentOrderForm>;

const Template: ComponentStory<typeof CompleteTreatmentOrderForm> = (args) => (
  <CompleteTreatmentOrderForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
