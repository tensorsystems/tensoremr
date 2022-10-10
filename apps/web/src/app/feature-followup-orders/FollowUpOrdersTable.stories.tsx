import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FollowUpOrdersTable } from './FollowUpOrdersTable';

export default {
  component: FollowUpOrdersTable,
  title: 'FollowUpOrdersTable',
} as ComponentMeta<typeof FollowUpOrdersTable>;

const Template: ComponentStory<typeof FollowUpOrdersTable> = (args) => (
  <FollowUpOrdersTable {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
