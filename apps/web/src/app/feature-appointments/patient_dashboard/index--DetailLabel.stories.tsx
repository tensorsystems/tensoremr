import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DetailLabel } from './index';

export default {
  component: DetailLabel,
  title: 'DetailLabel',
} as ComponentMeta<typeof DetailLabel>;

const Template: ComponentStory<typeof DetailLabel> = (args) => (
  <DetailLabel {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
