import { ComponentStory, ComponentMeta } from '@storybook/react';
import { handleQueueCreate } from './feature-patient-queue';

export default {
  component: handleQueueCreate,
  title: 'handleQueueCreate',
} as ComponentMeta<typeof handleQueueCreate>;

const Template: ComponentStory<typeof handleQueueCreate> = (args) => (
  <handleQueueCreate {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
