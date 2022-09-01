import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Actionbar } from './ActionBar';

export default {
  component: Actionbar,
  title: 'Actionbar',
} as ComponentMeta<typeof Actionbar>;

const Template: ComponentStory<typeof Actionbar> = (args) => (
  <Actionbar {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
