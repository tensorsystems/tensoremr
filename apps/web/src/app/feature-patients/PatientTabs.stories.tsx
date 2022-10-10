import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PatientTabs } from './PatientTabs';

export default {
  component: PatientTabs,
  title: 'PatientTabs',
} as ComponentMeta<typeof PatientTabs>;

const Template: ComponentStory<typeof PatientTabs> = (args) => (
  <PatientTabs {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
