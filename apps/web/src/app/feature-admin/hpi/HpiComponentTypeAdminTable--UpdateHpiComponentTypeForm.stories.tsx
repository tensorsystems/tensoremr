import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UpdateHpiComponentTypeForm } from './HpiComponentTypeAdminTable';

export default {
  component: UpdateHpiComponentTypeForm,
  title: 'UpdateHpiComponentTypeForm',
} as ComponentMeta<typeof UpdateHpiComponentTypeForm>;

const Template: ComponentStory<typeof UpdateHpiComponentTypeForm> = (args) => (
  <UpdateHpiComponentTypeForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
