import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PastMedicationsAllergies } from './index';

export default {
  component: PastMedicationsAllergies,
  title: 'PastMedicationsAllergies',
} as ComponentMeta<typeof PastMedicationsAllergies>;

const Template: ComponentStory<typeof PastMedicationsAllergies> = (args) => (
  <PastMedicationsAllergies {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
