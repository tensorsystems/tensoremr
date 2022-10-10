import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PatientQueuePage } from './feature-patient-queue';

export default {
  component: PatientQueuePage,
  title: 'PatientQueuePage',
} as ComponentMeta<typeof PatientQueuePage>;

const Template: ComponentStory<typeof PatientQueuePage> = (args) => (
  <PatientQueuePage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
