import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UpdateSystemForm } from './SystemAdminTable';

export default {
  component: UpdateSystemForm,
  title: 'UpdateSystemForm',
} as ComponentMeta<typeof UpdateSystemForm>;

const Template: ComponentStory<typeof UpdateSystemForm> = (args) => (
  <UpdateSystemForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
