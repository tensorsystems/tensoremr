import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AddLabTypeForm } from './AddLabTypeForm';

export default {
  component: AddLabTypeForm,
  title: 'AddLabTypeForm',
} as ComponentMeta<typeof AddLabTypeForm>;

const Template: ComponentStory<typeof AddLabTypeForm> = (args) => (
  <AddLabTypeForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
