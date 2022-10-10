import { ComponentStory, ComponentMeta } from '@storybook/react';
import { OrderTreatmentForm } from './OrderTreatmentForm';

export default {
  component: OrderTreatmentForm,
  title: 'OrderTreatmentForm',
} as ComponentMeta<typeof OrderTreatmentForm>;

const Template: ComponentStory<typeof OrderTreatmentForm> = (args) => (
  <OrderTreatmentForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
