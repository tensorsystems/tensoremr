import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AddHpiComponentTypeForm } from './HpiComponentTypeAdminTable';

export default {
  component: AddHpiComponentTypeForm,
  title: 'AddHpiComponentTypeForm',
} as ComponentMeta<typeof AddHpiComponentTypeForm>;

const Template: ComponentStory<typeof AddHpiComponentTypeForm> = (args) => (
  <AddHpiComponentTypeForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
