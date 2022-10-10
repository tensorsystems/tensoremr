import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FavoriteMedicationList } from './FavoriteMedicationList';

export default {
  component: FavoriteMedicationList,
  title: 'FavoriteMedicationList',
} as ComponentMeta<typeof FavoriteMedicationList>;

const Template: ComponentStory<typeof FavoriteMedicationList> = (args) => (
  <FavoriteMedicationList {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
