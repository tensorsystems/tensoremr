import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PreOpPage } from './index';

export default {
  component: PreOpPage,
  title: 'PreOpPage',
} as ComponentMeta<typeof PreOpPage>;

const Template: ComponentStory<typeof PreOpPage> = (args) => (
  <PreOpPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
