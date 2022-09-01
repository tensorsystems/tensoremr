import { ComponentStory, ComponentMeta } from '@storybook/react';
import { TablePagination } from './TablePagination';

export default {
  component: TablePagination,
  title: 'TablePagination',
} as ComponentMeta<typeof TablePagination>;

const Template: ComponentStory<typeof TablePagination> = (args) => (
  <TablePagination {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
