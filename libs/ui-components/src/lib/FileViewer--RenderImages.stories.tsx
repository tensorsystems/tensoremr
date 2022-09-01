import { ComponentStory, ComponentMeta } from '@storybook/react';
import { RenderImages } from './FileViewer';

export default {
  component: RenderImages,
  title: 'RenderImages',
} as ComponentMeta<typeof RenderImages>;

const Template: ComponentStory<typeof RenderImages> = (args) => (
  <RenderImages {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
