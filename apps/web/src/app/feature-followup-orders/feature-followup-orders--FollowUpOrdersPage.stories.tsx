import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FollowUpOrdersPage } from './feature-followup-orders';

export default {
  component: FollowUpOrdersPage,
  title: 'FollowUpOrdersPage',
} as ComponentMeta<typeof FollowUpOrdersPage>;

const Template: ComponentStory<typeof FollowUpOrdersPage> = (args) => (
  <FollowUpOrdersPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
