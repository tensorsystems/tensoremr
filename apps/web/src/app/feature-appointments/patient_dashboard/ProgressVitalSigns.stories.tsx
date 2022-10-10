import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ProgressVitalSigns } from './ProgressVitalSigns';

export default {
  component: ProgressVitalSigns,
  title: 'ProgressVitalSigns',
} as ComponentMeta<typeof ProgressVitalSigns>;

const Template: ComponentStory<typeof ProgressVitalSigns> = (args) => (
  <ProgressVitalSigns {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
