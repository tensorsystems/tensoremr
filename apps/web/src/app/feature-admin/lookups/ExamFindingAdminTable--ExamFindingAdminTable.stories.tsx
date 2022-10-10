import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ExamFindingAdminTable } from './ExamFindingAdminTable';

export default {
  component: ExamFindingAdminTable,
  title: 'ExamFindingAdminTable',
} as ComponentMeta<typeof ExamFindingAdminTable>;

const Template: ComponentStory<typeof ExamFindingAdminTable> = (args) => (
  <ExamFindingAdminTable {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
