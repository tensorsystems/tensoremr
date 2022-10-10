import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PatientContactInfo } from './PatientContactInfo';

export default {
  component: PatientContactInfo,
  title: 'PatientContactInfo',
} as ComponentMeta<typeof PatientContactInfo>;

const Template: ComponentStory<typeof PatientContactInfo> = (args) => (
  <PatientContactInfo {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
