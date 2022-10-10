import { ComponentStory, ComponentMeta } from '@storybook/react';
import { OphthalmologyVitalSigns } from './OphthalmologyVitalSigns';

export default {
  component: OphthalmologyVitalSigns,
  title: 'OphthalmologyVitalSigns',
} as ComponentMeta<typeof OphthalmologyVitalSigns>;

const Template: ComponentStory<typeof OphthalmologyVitalSigns> = (args) => (
  <OphthalmologyVitalSigns {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
