import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PositiveFindings } from './index';

export default {
  component: PositiveFindings,
  title: 'PositiveFindings',
} as ComponentMeta<typeof PositiveFindings>;

const Template: ComponentStory<typeof PositiveFindings> = (args) => (
  <PositiveFindings {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
