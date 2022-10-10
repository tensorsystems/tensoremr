import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PatientDiagnosticOrders } from './index';

export default {
  component: PatientDiagnosticOrders,
  title: 'PatientDiagnosticOrders',
} as ComponentMeta<typeof PatientDiagnosticOrders>;

const Template: ComponentStory<typeof PatientDiagnosticOrders> = (args) => (
  <PatientDiagnosticOrders {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
