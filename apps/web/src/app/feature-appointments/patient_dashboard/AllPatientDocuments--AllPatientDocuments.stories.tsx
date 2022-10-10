import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AllPatientDocuments } from './AllPatientDocuments';

export default {
  component: AllPatientDocuments,
  title: 'AllPatientDocuments',
} as ComponentMeta<typeof AllPatientDocuments>;

const Template: ComponentStory<typeof AllPatientDocuments> = (args) => (
  <AllPatientDocuments {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
