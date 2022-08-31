import { ComponentStory, ComponentMeta } from '@storybook/react';
import { actions } from './ActionBar';

export default {
  component: actions,
  title: 'actions',
} as ComponentMeta<typeof actions>;

const Template: ComponentStory<typeof actions> = (args) => (
  <actions {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
