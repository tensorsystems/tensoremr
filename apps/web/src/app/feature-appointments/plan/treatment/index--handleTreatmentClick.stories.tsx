import { ComponentStory, ComponentMeta } from '@storybook/react';
import { handleTreatmentClick } from './index';

export default {
  component: handleTreatmentClick,
  title: 'handleTreatmentClick',
} as ComponentMeta<typeof handleTreatmentClick>;

const Template: ComponentStory<typeof handleTreatmentClick> = (args) => (
  <handleTreatmentClick {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
