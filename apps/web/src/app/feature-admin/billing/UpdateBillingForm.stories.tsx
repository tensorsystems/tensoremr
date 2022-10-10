import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UpdateBillingForm } from './UpdateBillingForm';

export default {
  component: UpdateBillingForm,
  title: 'UpdateBillingForm',
} as ComponentMeta<typeof UpdateBillingForm>;

const Template: ComponentStory<typeof UpdateBillingForm> = (args) => (
  <UpdateBillingForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
