import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MedicationSideInfo } from './MedicationSideInfo';

export default {
  component: MedicationSideInfo,
  title: 'MedicationSideInfo',
} as ComponentMeta<typeof MedicationSideInfo>;

const Template: ComponentStory<typeof MedicationSideInfo> = (args) => (
  <MedicationSideInfo {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
