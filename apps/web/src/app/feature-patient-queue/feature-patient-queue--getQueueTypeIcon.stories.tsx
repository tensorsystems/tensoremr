import { ComponentStory, ComponentMeta } from '@storybook/react';
import { getQueueTypeIcon } from './feature-patient-queue';

export default {
  component: getQueueTypeIcon,
  title: 'getQueueTypeIcon',
} as ComponentMeta<typeof getQueueTypeIcon>;

const Template: ComponentStory<typeof getQueueTypeIcon> = (args) => (
  <getQueueTypeIcon {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
