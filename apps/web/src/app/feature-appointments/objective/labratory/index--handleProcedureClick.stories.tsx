import { ComponentStory, ComponentMeta } from '@storybook/react';
import { handleProcedureClick } from './index';

export default {
  component: handleProcedureClick,
  title: 'handleProcedureClick',
} as ComponentMeta<typeof handleProcedureClick>;

const Template: ComponentStory<typeof handleProcedureClick> = (args) => (
  <handleProcedureClick {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
