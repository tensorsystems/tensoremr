import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SearchBarAppointments } from './SearchBar';

export default {
  component: SearchBarAppointments,
  title: 'SearchBarAppointments',
} as ComponentMeta<typeof SearchBarAppointments>;

const Template: ComponentStory<typeof SearchBarAppointments> = (args) => (
  <SearchBarAppointments {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
