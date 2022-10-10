import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AddSystemSymptomForm } from './SystemSymptomAdminTable';

export default {
  component: AddSystemSymptomForm,
  title: 'AddSystemSymptomForm',
} as ComponentMeta<typeof AddSystemSymptomForm>;

const Template: ComponentStory<typeof AddSystemSymptomForm> = (args) => (
  <AddSystemSymptomForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
