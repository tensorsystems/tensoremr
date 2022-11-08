import { ComponentStory, ComponentMeta } from '@storybook/react';
import SchedulesAdminTable, { Schedule } from './SchedulesAdminTable';

const Story: ComponentMeta<typeof SchedulesAdminTable> = {
  component: SchedulesAdminTable,
  title: 'SchedulesAdminTable',
};
export default Story;

const Template: ComponentStory<typeof SchedulesAdminTable> = (args) => (
  <SchedulesAdminTable {...args} />
);

export const Primary = Template.bind({});
const schedules: Schedule[] = [
  {
    id: '1',
    resourceType: 'practitioner',
    resource: 'Dr. Tiliksew Teshome',
    serviceType: 'Ophthalmology',
    speciality: 'Medical Ophthalmology',
    startPeriod: '2022-11-05T00:00:00',
    endPeriod: '2022-12-05T02:00:00',
    recurring: true,
  },
  {
    id: '2',
    resourceType: 'practitioner',
    resource: 'Dr. Zelalem Eshetu',
    serviceType: 'Ophthalmology',
    speciality: 'Medical Ophthalmology',
    startPeriod: '2022-11-05T00:00:00',
    endPeriod: '2022-12-05T02:00:00',
    recurring: false,
  },
  {
    id: '3',
    resourceType: 'room',
    resource: 'Exam Room 1',
    serviceType: 'Ophthalmology',
    speciality: 'Medical Ophthalmology',
    startPeriod: '2022-11-05T00:00:00',
    endPeriod: '2022-12-05T02:00:00',
    recurring: true,
  },
];

Primary.args = {
  schedules,
};
