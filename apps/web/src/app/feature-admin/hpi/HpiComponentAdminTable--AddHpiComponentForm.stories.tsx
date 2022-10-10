import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AddHpiComponentForm } from './HpiComponentAdminTable';

export default {
  component: AddHpiComponentForm,
  title: 'AddHpiComponentForm',
} as ComponentMeta<typeof AddHpiComponentForm>;

const Template: ComponentStory<typeof AddHpiComponentForm> = (args) => (
  <AddHpiComponentForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
