import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Stickie } from './StickieComponent';

export default {
  component: Stickie,
  title: 'Stickie',
} as ComponentMeta<typeof Stickie>;

const Template: ComponentStory<typeof Stickie> = (args) => (
  <Stickie {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
