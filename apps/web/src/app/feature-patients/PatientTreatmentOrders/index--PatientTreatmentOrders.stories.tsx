import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PatientTreatmentOrders } from './index';

export default {
  component: PatientTreatmentOrders,
  title: 'PatientTreatmentOrders',
} as ComponentMeta<typeof PatientTreatmentOrders>;

const Template: ComponentStory<typeof PatientTreatmentOrders> = (args) => (
  <PatientTreatmentOrders {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
