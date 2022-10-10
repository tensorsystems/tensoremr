import { ComponentStory, ComponentMeta } from '@storybook/react';
import { HpiComponentTypeTable } from './HpiComponentTypeAdminTable';

export default {
  component: HpiComponentTypeTable,
  title: 'HpiComponentTypeTable',
} as ComponentMeta<typeof HpiComponentTypeTable>;

const Template: ComponentStory<typeof HpiComponentTypeTable> = (args) => (
  <HpiComponentTypeTable {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
