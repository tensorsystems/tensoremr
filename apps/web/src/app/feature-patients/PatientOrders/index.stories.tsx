import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PatientOrders } from './index';

export default {
  component: PatientOrders,
  title: 'PatientOrders',
} as ComponentMeta<typeof PatientOrders>;

const Template: ComponentStory<typeof PatientOrders> = (args) => (
  <PatientOrders {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
