import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PatientsPage } from './index';

export default {
  component: PatientsPage,
  title: 'PatientsPage',
} as ComponentMeta<typeof PatientsPage>;

const Template: ComponentStory<typeof PatientsPage> = (args) => (
  <PatientsPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
