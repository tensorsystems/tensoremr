import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PatientSurgicalOrders } from './index';

export default {
  component: PatientSurgicalOrders,
  title: 'PatientSurgicalOrders',
} as ComponentMeta<typeof PatientSurgicalOrders>;

const Template: ComponentStory<typeof PatientSurgicalOrders> = (args) => (
  <PatientSurgicalOrders {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
