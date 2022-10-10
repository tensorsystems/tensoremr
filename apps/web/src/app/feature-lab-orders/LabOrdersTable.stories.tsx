import { ComponentStory, ComponentMeta } from '@storybook/react';
import { LabOrdersTable } from './LabOrdersTable';

export default {
  component: LabOrdersTable,
  title: 'LabOrdersTable',
} as ComponentMeta<typeof LabOrdersTable>;

const Template: ComponentStory<typeof LabOrdersTable> = (args) => (
  <LabOrdersTable {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
