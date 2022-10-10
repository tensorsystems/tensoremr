import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ProgressChip } from './index';

export default {
  component: ProgressChip,
  title: 'ProgressChip',
} as ComponentMeta<typeof ProgressChip>;

const Template: ComponentStory<typeof ProgressChip> = (args) => (
  <ProgressChip {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
