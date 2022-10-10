import { ComponentStory, ComponentMeta } from '@storybook/react';
import { TreatmentOrdersTable } from './TreatmentOrdersTable';

export default {
  component: TreatmentOrdersTable,
  title: 'TreatmentOrdersTable',
} as ComponentMeta<typeof TreatmentOrdersTable>;

const Template: ComponentStory<typeof TreatmentOrdersTable> = (args) => (
  <TreatmentOrdersTable {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
