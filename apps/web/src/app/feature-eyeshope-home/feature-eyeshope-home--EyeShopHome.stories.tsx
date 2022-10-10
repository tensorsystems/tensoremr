import { ComponentStory, ComponentMeta } from '@storybook/react';
import { EyeShopHome } from './feature-eyeshope-home';

export default {
  component: EyeShopHome,
  title: 'EyeShopHome',
} as ComponentMeta<typeof EyeShopHome>;

const Template: ComponentStory<typeof EyeShopHome> = (args) => (
  <EyeShopHome {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
