import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AddAmendmentForm } from './AddAmendmentForm';

export default {
  component: AddAmendmentForm,
  title: 'AddAmendmentForm',
} as ComponentMeta<typeof AddAmendmentForm>;

const Template: ComponentStory<typeof AddAmendmentForm> = (args) => (
  <AddAmendmentForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
