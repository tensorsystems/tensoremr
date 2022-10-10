import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AllergyTable } from './AllergyTable';

export default {
  component: AllergyTable,
  title: 'AllergyTable',
} as ComponentMeta<typeof AllergyTable>;

const Template: ComponentStory<typeof AllergyTable> = (args) => (
  <AllergyTable {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
