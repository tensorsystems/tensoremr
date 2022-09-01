import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FileViewer } from './FileViewer';

export default {
  component: FileViewer,
  title: 'FileViewer',
} as ComponentMeta<typeof FileViewer>;

const Template: ComponentStory<typeof FileViewer> = (args) => (
  <FileViewer {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
