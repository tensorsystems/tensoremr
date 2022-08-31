import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MedicationTable } from './MedicationTable';

export default {
  component: MedicationTable,
  title: 'MedicationTable',
} as ComponentMeta<typeof MedicationTable>;

const Template: ComponentStory<typeof MedicationTable> = (args) => (
  <MedicationTable {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
