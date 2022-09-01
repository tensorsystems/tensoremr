import { ComponentStory, ComponentMeta } from '@storybook/react';
import { CompleteSurgicalOrderForm } from './CompleteSurgicalOrderForm';

export default {
  component: CompleteSurgicalOrderForm,
  title: 'CompleteSurgicalOrderForm',
} as ComponentMeta<typeof CompleteSurgicalOrderForm>;

const Template: ComponentStory<typeof CompleteSurgicalOrderForm> = (args) => (
  <CompleteSurgicalOrderForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
