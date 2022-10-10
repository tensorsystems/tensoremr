import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SurgicalOrdersTable } from './SurgicalOrdersTable';

export default {
  component: SurgicalOrdersTable,
  title: 'SurgicalOrdersTable',
} as ComponentMeta<typeof SurgicalOrdersTable>;

const Template: ComponentStory<typeof SurgicalOrdersTable> = (args) => (
  <SurgicalOrdersTable {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
