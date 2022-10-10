import { ComponentStory, ComponentMeta } from '@storybook/react';
import { handleQueueAdd } from './feature-patient-queue';

export default {
  component: handleQueueAdd,
  title: 'handleQueueAdd',
} as ComponentMeta<typeof handleQueueAdd>;

const Template: ComponentStory<typeof handleQueueAdd> = (args) => (
  <handleQueueAdd {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
