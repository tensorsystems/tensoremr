import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UpdateHpiComponentForm } from './HpiComponentAdminTable';

export default {
  component: UpdateHpiComponentForm,
  title: 'UpdateHpiComponentForm',
} as ComponentMeta<typeof UpdateHpiComponentForm>;

const Template: ComponentStory<typeof UpdateHpiComponentForm> = (args) => (
  <UpdateHpiComponentForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
