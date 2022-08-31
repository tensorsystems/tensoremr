import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StatCard } from './StatCard';

export default {
  component: StatCard,
  title: 'StatCard',
} as ComponentMeta<typeof StatCard>;

const Template: ComponentStory<typeof StatCard> = (args) => (
  <StatCard {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
