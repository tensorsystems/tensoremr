import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Patients } from './feature-patients';

export default {
  component: Patients,
  title: 'Patients',
} as ComponentMeta<typeof Patients>;

const Template: ComponentStory<typeof Patients> = (args) => (
  <Patients {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
