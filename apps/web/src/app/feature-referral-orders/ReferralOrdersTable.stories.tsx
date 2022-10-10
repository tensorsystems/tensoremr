import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ReferralOrdersTable } from './ReferralOrdersTable';

export default {
  component: ReferralOrdersTable,
  title: 'ReferralOrdersTable',
} as ComponentMeta<typeof ReferralOrdersTable>;

const Template: ComponentStory<typeof ReferralOrdersTable> = (args) => (
  <ReferralOrdersTable {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
