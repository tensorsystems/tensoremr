import { ComponentStory, ComponentMeta } from '@storybook/react';
import { WorkflowTable } from './index';

export default {
  component: WorkflowTable,
  title: 'WorkflowTable',
} as ComponentMeta<typeof WorkflowTable>;

const Template: ComponentStory<typeof WorkflowTable> = (args) => (
  <WorkflowTable {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
