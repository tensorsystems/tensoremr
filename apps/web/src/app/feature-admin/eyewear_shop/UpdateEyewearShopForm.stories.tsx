import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UpdateEyewearShopForm } from './UpdateEyewearShopForm';

export default {
  component: UpdateEyewearShopForm,
  title: 'UpdateEyewearShopForm',
} as ComponentMeta<typeof UpdateEyewearShopForm>;

const Template: ComponentStory<typeof UpdateEyewearShopForm> = (args) => (
  <UpdateEyewearShopForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
