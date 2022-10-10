import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SystemAdminTable } from './SystemAdminTable';

export default {
  component: SystemAdminTable,
  title: 'SystemAdminTable',
} as ComponentMeta<typeof SystemAdminTable>;

const Template: ComponentStory<typeof SystemAdminTable> = (args) => (
  <SystemAdminTable {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
