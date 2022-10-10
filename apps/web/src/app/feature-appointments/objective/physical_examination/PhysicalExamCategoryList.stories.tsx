import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PhysicalExamCategoryList } from './PhysicalExamCategoryList';

export default {
  component: PhysicalExamCategoryList,
  title: 'PhysicalExamCategoryList',
} as ComponentMeta<typeof PhysicalExamCategoryList>;

const Template: ComponentStory<typeof PhysicalExamCategoryList> = (args) => (
  <PhysicalExamCategoryList {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
