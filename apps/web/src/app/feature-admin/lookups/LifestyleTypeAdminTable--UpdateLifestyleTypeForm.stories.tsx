import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UpdateLifestyleTypeForm } from './LifestyleTypeAdminTable';

export default {
  component: UpdateLifestyleTypeForm,
  title: 'UpdateLifestyleTypeForm',
} as ComponentMeta<typeof UpdateLifestyleTypeForm>;

const Template: ComponentStory<typeof UpdateLifestyleTypeForm> = (args) => (
  <UpdateLifestyleTypeForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
