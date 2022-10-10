import { ComponentStory, ComponentMeta } from '@storybook/react';
import { BillingsAdmin } from './index';

export default {
  component: BillingsAdmin,
  title: 'BillingsAdmin',
} as ComponentMeta<typeof BillingsAdmin>;

const Template: ComponentStory<typeof BillingsAdmin> = (args) => (
  <BillingsAdmin {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
