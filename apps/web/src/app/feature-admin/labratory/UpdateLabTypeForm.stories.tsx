import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UpdateLabTypeForm } from './UpdateLabTypeForm';

export default {
  component: UpdateLabTypeForm,
  title: 'UpdateLabTypeForm',
} as ComponentMeta<typeof UpdateLabTypeForm>;

const Template: ComponentStory<typeof UpdateLabTypeForm> = (args) => (
  <UpdateLabTypeForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
