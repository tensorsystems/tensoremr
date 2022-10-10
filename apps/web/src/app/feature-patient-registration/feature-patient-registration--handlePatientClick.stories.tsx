import { ComponentStory, ComponentMeta } from '@storybook/react';
import { handlePatientClick } from './feature-patient-registration';

export default {
  component: handlePatientClick,
  title: 'handlePatientClick',
} as ComponentMeta<typeof handlePatientClick>;

const Template: ComponentStory<typeof handlePatientClick> = (args) => (
  <handlePatientClick {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
