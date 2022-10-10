import { ComponentStory, ComponentMeta } from '@storybook/react';
import { LifestyleTypesTable } from './LifestyleTypeAdminTable';

export default {
  component: LifestyleTypesTable,
  title: 'LifestyleTypesTable',
} as ComponentMeta<typeof LifestyleTypesTable>;

const Template: ComponentStory<typeof LifestyleTypesTable> = (args) => (
  <LifestyleTypesTable {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
