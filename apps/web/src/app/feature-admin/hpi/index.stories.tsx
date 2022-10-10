import { ComponentStory, ComponentMeta } from '@storybook/react';
import { HpiPage } from './index';

export default {
  component: HpiPage,
  title: 'HpiPage',
} as ComponentMeta<typeof HpiPage>;

const Template: ComponentStory<typeof HpiPage> = (args) => (
  <HpiPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
