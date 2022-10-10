import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AddExamCategoryForm } from './ExamCategoryAdminTable';

export default {
  component: AddExamCategoryForm,
  title: 'AddExamCategoryForm',
} as ComponentMeta<typeof AddExamCategoryForm>;

const Template: ComponentStory<typeof AddExamCategoryForm> = (args) => (
  <AddExamCategoryForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
