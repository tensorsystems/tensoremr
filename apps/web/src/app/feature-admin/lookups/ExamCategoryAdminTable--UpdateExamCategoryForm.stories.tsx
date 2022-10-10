import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UpdateExamCategoryForm } from './ExamCategoryAdminTable';

export default {
  component: UpdateExamCategoryForm,
  title: 'UpdateExamCategoryForm',
} as ComponentMeta<typeof UpdateExamCategoryForm>;

const Template: ComponentStory<typeof UpdateExamCategoryForm> = (args) => (
  <UpdateExamCategoryForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
