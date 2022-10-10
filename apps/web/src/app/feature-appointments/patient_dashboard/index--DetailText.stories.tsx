import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DetailText } from './index';

export default {
  component: DetailText,
  title: 'DetailText',
} as ComponentMeta<typeof DetailText>;

const Template: ComponentStory<typeof DetailText> = (args) => (
  <DetailText {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
