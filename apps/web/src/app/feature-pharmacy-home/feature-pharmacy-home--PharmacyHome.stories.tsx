import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PharmacyHome } from './feature-pharmacy-home';

export default {
  component: PharmacyHome,
  title: 'PharmacyHome',
} as ComponentMeta<typeof PharmacyHome>;

const Template: ComponentStory<typeof PharmacyHome> = (args) => (
  <PharmacyHome {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
