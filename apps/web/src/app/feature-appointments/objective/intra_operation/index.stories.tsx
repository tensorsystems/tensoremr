import { ComponentStory, ComponentMeta } from '@storybook/react';
import { IntraOpPage } from './index';

export default {
  component: IntraOpPage,
  title: 'IntraOpPage',
} as ComponentMeta<typeof IntraOpPage>;

const Template: ComponentStory<typeof IntraOpPage> = (args) => (
  <IntraOpPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
