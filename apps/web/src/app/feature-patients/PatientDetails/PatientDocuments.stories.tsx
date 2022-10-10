import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PatientDocuments } from './PatientDocuments';

export default {
  component: PatientDocuments,
  title: 'PatientDocuments',
} as ComponentMeta<typeof PatientDocuments>;

const Template: ComponentStory<typeof PatientDocuments> = (args) => (
  <PatientDocuments {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
