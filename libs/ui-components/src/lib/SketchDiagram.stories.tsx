import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SketchDiagram } from './SketchDiagram';

export default {
  component: SketchDiagram,
  title: 'SketchDiagram',
} as ComponentMeta<typeof SketchDiagram>;

const Template: ComponentStory<typeof SketchDiagram> = (args) => (
  <SketchDiagram {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
