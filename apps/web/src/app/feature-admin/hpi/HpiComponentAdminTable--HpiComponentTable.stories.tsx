import { ComponentStory, ComponentMeta } from '@storybook/react';
import { HpiComponentTable } from './HpiComponentAdminTable';

export default {
  component: HpiComponentTable,
  title: 'HpiComponentTable',
} as ComponentMeta<typeof HpiComponentTable>;

const Template: ComponentStory<typeof HpiComponentTable> = (args) => (
  <HpiComponentTable {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
