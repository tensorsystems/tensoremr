import { ComponentStory, ComponentMeta } from '@storybook/react';
import SchedulesAdminTable from './SchedulesAdminTable';

const Story: ComponentMeta<typeof SchedulesAdminTable> = {
  component: SchedulesAdminTable,
  title: 'SchedulesAdminTable',
};
export default Story;

const Template: ComponentStory<typeof SchedulesAdminTable> = (args) => (
  <SchedulesAdminTable />
);

export const Primary = Template.bind({});
Primary.args = {};
