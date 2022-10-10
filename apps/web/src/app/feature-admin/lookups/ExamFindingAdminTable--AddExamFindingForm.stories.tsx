import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AddExamFindingForm } from './ExamFindingAdminTable';

export default {
  component: AddExamFindingForm,
  title: 'AddExamFindingForm',
} as ComponentMeta<typeof AddExamFindingForm>;

const Template: ComponentStory<typeof AddExamFindingForm> = (args) => (
  <AddExamFindingForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
