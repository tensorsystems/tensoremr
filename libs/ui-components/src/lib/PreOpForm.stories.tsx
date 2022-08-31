import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PreOpForm } from './PreOpForm';

export default {
  component: PreOpForm,
  title: 'PreOpForm',
} as ComponentMeta<typeof PreOpForm>;

const Template: ComponentStory<typeof PreOpForm> = (args) => (
  <PreOpForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
