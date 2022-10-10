import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PatientsTable } from './feature-reception-home';

export default {
  component: PatientsTable,
  title: 'PatientsTable',
} as ComponentMeta<typeof PatientsTable>;

const Template: ComponentStory<typeof PatientsTable> = (args) => (
  <PatientsTable {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
