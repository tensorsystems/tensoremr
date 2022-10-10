import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Progress } from './index';

export default {
  component: Progress,
  title: 'Progress',
} as ComponentMeta<typeof Progress>;

const Template: ComponentStory<typeof Progress> = (args) => (
  <Progress {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
