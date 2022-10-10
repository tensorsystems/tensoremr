import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PatientDashboard } from './index';

export default {
  component: PatientDashboard,
  title: 'PatientDashboard',
} as ComponentMeta<typeof PatientDashboard>;

const Template: ComponentStory<typeof PatientDashboard> = (args) => (
  <PatientDashboard {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
