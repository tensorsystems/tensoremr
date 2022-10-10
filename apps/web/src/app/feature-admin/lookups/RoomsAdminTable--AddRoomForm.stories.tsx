import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AddRoomForm } from './RoomsAdminTable';

export default {
  component: AddRoomForm,
  title: 'AddRoomForm',
} as ComponentMeta<typeof AddRoomForm>;

const Template: ComponentStory<typeof AddRoomForm> = (args) => (
  <AddRoomForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
