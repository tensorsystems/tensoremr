import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ExamCategoryAdminTable } from './ExamCategoryAdminTable';

export default {
  component: ExamCategoryAdminTable,
  title: 'ExamCategoryAdminTable',
} as ComponentMeta<typeof ExamCategoryAdminTable>;

const Template: ComponentStory<typeof ExamCategoryAdminTable> = (args) => (
  <ExamCategoryAdminTable {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
