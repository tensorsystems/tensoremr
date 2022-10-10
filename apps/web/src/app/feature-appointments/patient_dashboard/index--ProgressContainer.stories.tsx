import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ProgressContainer } from './index';

export default {
  component: ProgressContainer,
  title: 'ProgressContainer',
} as ComponentMeta<typeof ProgressContainer>;

const Template: ComponentStory<typeof ProgressContainer> = (args) => (
  <ProgressContainer {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
