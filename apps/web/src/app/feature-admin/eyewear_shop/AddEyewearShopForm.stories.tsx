import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AddEyewearShopForm } from './AddEyewearShopForm';

export default {
  component: AddEyewearShopForm,
  title: 'AddEyewearShopForm',
  argTypes: {
    onSuccess: { action: 'onSuccess executed!' },
    onError: { action: 'onError executed!' },
    onCancel: { action: 'onCancel executed!' },
  },
} as ComponentMeta<typeof AddEyewearShopForm>;

const Template: ComponentStory<typeof AddEyewearShopForm> = (args) => (
  <AddEyewearShopForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
