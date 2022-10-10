import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SummaryPage } from './index';

export default {
  component: SummaryPage,
  title: 'SummaryPage',
} as ComponentMeta<typeof SummaryPage>;

const Template: ComponentStory<typeof SummaryPage> = (args) => (
  <SummaryPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
