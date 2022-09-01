import { ComponentStory, ComponentMeta } from '@storybook/react';
import { RenderDocument } from './FileViewer';

export default {
  component: RenderDocument,
  title: 'RenderDocument',
} as ComponentMeta<typeof RenderDocument>;

const Template: ComponentStory<typeof RenderDocument> = (args) => (
  <RenderDocument {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
