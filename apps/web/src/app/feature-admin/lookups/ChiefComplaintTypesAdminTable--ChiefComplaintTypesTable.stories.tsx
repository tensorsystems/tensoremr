import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ChiefComplaintTypesTable } from './ChiefComplaintTypesAdminTable';

export default {
  component: ChiefComplaintTypesTable,
  title: 'ChiefComplaintTypesTable',
} as ComponentMeta<typeof ChiefComplaintTypesTable>;

const Template: ComponentStory<typeof ChiefComplaintTypesTable> = (args) => (
  <ChiefComplaintTypesTable {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
