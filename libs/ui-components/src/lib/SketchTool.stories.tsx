import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SketchTool } from './SketchTool';

export default {
  component: SketchTool,
  title: 'SketchTool',
} as ComponentMeta<typeof SketchTool>;

const Template: ComponentStory<typeof SketchTool> = (args) => (
  <SketchTool {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
