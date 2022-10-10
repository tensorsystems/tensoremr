import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FamilyHistoryPage } from './index';

export default {
  component: FamilyHistoryPage,
  title: 'FamilyHistoryPage',
} as ComponentMeta<typeof FamilyHistoryPage>;

const Template: ComponentStory<typeof FamilyHistoryPage> = (args) => (
  <FamilyHistoryPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
