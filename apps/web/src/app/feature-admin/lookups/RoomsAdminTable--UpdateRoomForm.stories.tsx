import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UpdateRoomForm } from './RoomsAdminTable';

export default {
  component: UpdateRoomForm,
  title: 'UpdateRoomForm',
} as ComponentMeta<typeof UpdateRoomForm>;

const Template: ComponentStory<typeof UpdateRoomForm> = (args) => (
  <UpdateRoomForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
