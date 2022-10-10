import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SystemSymptomAdminTable } from './SystemSymptomAdminTable';

export default {
  component: SystemSymptomAdminTable,
  title: 'SystemSymptomAdminTable',
} as ComponentMeta<typeof SystemSymptomAdminTable>;

const Template: ComponentStory<typeof SystemSymptomAdminTable> = (args) => (
  <SystemSymptomAdminTable {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
