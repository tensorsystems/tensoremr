import { ComponentStory, ComponentMeta } from '@storybook/react';
import { EyeGlassTable } from './EyeGlassTable';

export default {
  component: EyeGlassTable,
  title: 'EyeGlassTable',
} as ComponentMeta<typeof EyeGlassTable>;

const Template: ComponentStory<typeof EyeGlassTable> = (args) => (
  <EyeGlassTable {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
