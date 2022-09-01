import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Components } from './components';

export default {
  component: Components,
  title: 'Components',
} as ComponentMeta<typeof Components>;

const Template: ComponentStory<typeof Components> = (args) => (
  <Components {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
