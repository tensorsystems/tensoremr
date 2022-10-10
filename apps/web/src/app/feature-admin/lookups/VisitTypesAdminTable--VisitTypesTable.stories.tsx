import { ComponentStory, ComponentMeta } from '@storybook/react';
import { VisitTypesTable } from './VisitTypesAdminTable';

export default {
  component: VisitTypesTable,
  title: 'VisitTypesTable',
} as ComponentMeta<typeof VisitTypesTable>;

const Template: ComponentStory<typeof VisitTypesTable> = (args) => (
  <VisitTypesTable {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
