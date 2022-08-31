import { ComponentStory, ComponentMeta } from '@storybook/react';
import { IntraOpForm } from './IntraOpForm';

export default {
  component: IntraOpForm,
  title: 'IntraOpForm',
} as ComponentMeta<typeof IntraOpForm>;

const Template: ComponentStory<typeof IntraOpForm> = (args) => (
  <IntraOpForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
