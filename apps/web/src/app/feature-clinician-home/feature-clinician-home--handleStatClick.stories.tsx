import { ComponentStory, ComponentMeta } from '@storybook/react';
import { handleStatClick } from './feature-clinician-home';

export default {
  component: handleStatClick,
  title: 'handleStatClick',
} as ComponentMeta<typeof handleStatClick>;

const Template: ComponentStory<typeof handleStatClick> = (args) => (
  <handleStatClick {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
