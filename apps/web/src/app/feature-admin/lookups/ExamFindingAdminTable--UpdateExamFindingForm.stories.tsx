import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UpdateExamFindingForm } from './ExamFindingAdminTable';

export default {
  component: UpdateExamFindingForm,
  title: 'UpdateExamFindingForm',
} as ComponentMeta<typeof UpdateExamFindingForm>;

const Template: ComponentStory<typeof UpdateExamFindingForm> = (args) => (
  <UpdateExamFindingForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
