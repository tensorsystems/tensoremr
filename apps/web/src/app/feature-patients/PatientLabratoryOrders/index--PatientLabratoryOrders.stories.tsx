import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PatientLabratoryOrders } from './index';

export default {
  component: PatientLabratoryOrders,
  title: 'PatientLabratoryOrders',
} as ComponentMeta<typeof PatientLabratoryOrders>;

const Template: ComponentStory<typeof PatientLabratoryOrders> = (args) => (
  <PatientLabratoryOrders {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
