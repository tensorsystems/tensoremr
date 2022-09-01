import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FileUploader } from './FileUploader';

export default {
  component: FileUploader,
  title: 'FileUploader',
} as ComponentMeta<typeof FileUploader>;

const Template: ComponentStory<typeof FileUploader> = (args) => (
  <FileUploader {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
