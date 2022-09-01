import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PrintFileHeader } from './PrintFileHeader';

export default {
  component: PrintFileHeader,
  title: 'PrintFileHeader',
} as ComponentMeta<typeof PrintFileHeader>;

const Template: ComponentStory<typeof PrintFileHeader> = (args) => (
  <PrintFileHeader {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
