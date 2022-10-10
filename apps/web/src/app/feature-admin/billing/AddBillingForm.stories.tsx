import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AddBillingForm } from './AddBillingForm';

export default {
  component: AddBillingForm,
  title: 'AddBillingForm',
} as ComponentMeta<typeof AddBillingForm>;

const Template: ComponentStory<typeof AddBillingForm> = (args) => (
  <AddBillingForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
