import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ExpandableItem } from './AllPatientDocuments';

export default {
  component: ExpandableItem,
  title: 'ExpandableItem',
} as ComponentMeta<typeof ExpandableItem>;

const Template: ComponentStory<typeof ExpandableItem> = (args) => (
  <ExpandableItem {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
