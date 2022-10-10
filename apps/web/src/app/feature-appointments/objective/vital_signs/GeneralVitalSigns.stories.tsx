import { ComponentStory, ComponentMeta } from '@storybook/react';
import { GeneralVitalSigns } from './GeneralVitalSigns';

export default {
  component: GeneralVitalSigns,
  title: 'GeneralVitalSigns',
} as ComponentMeta<typeof GeneralVitalSigns>;

const Template: ComponentStory<typeof GeneralVitalSigns> = (args) => (
  <GeneralVitalSigns {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
