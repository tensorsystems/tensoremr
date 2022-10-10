import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AddSystemForm } from './SystemAdminTable';

export default {
  component: AddSystemForm,
  title: 'AddSystemForm',
} as ComponentMeta<typeof AddSystemForm>;

const Template: ComponentStory<typeof AddSystemForm> = (args) => (
  <AddSystemForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
