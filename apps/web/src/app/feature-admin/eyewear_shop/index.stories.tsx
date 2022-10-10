import { ComponentStory, ComponentMeta } from '@storybook/react';
import { EyewearShopAdminPage } from './index';

export default {
  component: EyewearShopAdminPage,
  title: 'EyewearShopAdminPage',
} as ComponentMeta<typeof EyewearShopAdminPage>;

const Template: ComponentStory<typeof EyewearShopAdminPage> = (args) => (
  <EyewearShopAdminPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
