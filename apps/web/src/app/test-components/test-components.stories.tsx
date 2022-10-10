import { ComponentStory, ComponentMeta } from '@storybook/react';
import { TestComponents } from './test-components';

export default {
  component: TestComponents,
  title: 'TestComponents',
} as ComponentMeta<typeof TestComponents>;

const Template: ComponentStory<typeof TestComponents> = (args) => (
  <TestComponents {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
