import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SearchBarMedications } from './SearchBar';

export default {
  component: SearchBarMedications,
  title: 'SearchBarMedications',
} as ComponentMeta<typeof SearchBarMedications>;

const Template: ComponentStory<typeof SearchBarMedications> = (args) => (
  <SearchBarMedications {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
