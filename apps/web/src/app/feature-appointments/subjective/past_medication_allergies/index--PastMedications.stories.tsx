import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PastMedications } from './index';

export default {
  component: PastMedications,
  title: 'PastMedications',
} as ComponentMeta<typeof PastMedications>;

const Template: ComponentStory<typeof PastMedications> = (args) => (
  <PastMedications {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
