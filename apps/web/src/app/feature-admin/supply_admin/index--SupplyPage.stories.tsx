import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SupplyPage } from './index';

export default {
  component: SupplyPage,
  title: 'SupplyPage',
} as ComponentMeta<typeof SupplyPage>;

const Template: ComponentStory<typeof SupplyPage> = (args) => (
  <SupplyPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
