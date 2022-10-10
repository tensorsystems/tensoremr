import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UpdatePastInjuryForm } from './UpdatePastInjuryForm';

export default {
  component: UpdatePastInjuryForm,
  title: 'UpdatePastInjuryForm',
} as ComponentMeta<typeof UpdatePastInjuryForm>;

const Template: ComponentStory<typeof UpdatePastInjuryForm> = (args) => (
  <UpdatePastInjuryForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
