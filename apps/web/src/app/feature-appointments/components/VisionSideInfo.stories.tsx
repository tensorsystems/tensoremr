import { ComponentStory, ComponentMeta } from '@storybook/react';
import { VisionSideInfo } from './VisionSideInfo';

export default {
  component: VisionSideInfo,
  title: 'VisionSideInfo',
} as ComponentMeta<typeof VisionSideInfo>;

const Template: ComponentStory<typeof VisionSideInfo> = (args) => (
  <VisionSideInfo {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
