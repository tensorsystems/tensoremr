import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AddLifestyleTypeForm } from './LifestyleTypeAdminTable';

export default {
  component: AddLifestyleTypeForm,
  title: 'AddLifestyleTypeForm',
} as ComponentMeta<typeof AddLifestyleTypeForm>;

const Template: ComponentStory<typeof AddLifestyleTypeForm> = (args) => (
  <AddLifestyleTypeForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
