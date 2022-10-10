import { ComponentStory, ComponentMeta } from '@storybook/react';
import { EyewearShopOrdersList } from './EyeShopOrdersList';

export default {
  component: EyewearShopOrdersList,
  title: 'EyewearShopOrdersList',
} as ComponentMeta<typeof EyewearShopOrdersList>;

const Template: ComponentStory<typeof EyewearShopOrdersList> = (args) => (
  <EyewearShopOrdersList {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
