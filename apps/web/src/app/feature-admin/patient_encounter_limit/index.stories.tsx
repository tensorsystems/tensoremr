import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PatientEncounterLimitPage } from './index';

export default {
  component: PatientEncounterLimitPage,
  title: 'PatientEncounterLimitPage',
} as ComponentMeta<typeof PatientEncounterLimitPage>;

const Template: ComponentStory<typeof PatientEncounterLimitPage> = (args) => (
  <PatientEncounterLimitPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
