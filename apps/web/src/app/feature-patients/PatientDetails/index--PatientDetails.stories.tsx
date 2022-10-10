import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PatientDetails } from './index';

export default {
  component: PatientDetails,
  title: 'PatientDetails',
} as ComponentMeta<typeof PatientDetails>;

const Template: ComponentStory<typeof PatientDetails> = (args) => (
  <PatientDetails {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
