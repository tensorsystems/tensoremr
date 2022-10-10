import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PreanestheticPage } from './index';

export default {
  component: PreanestheticPage,
  title: 'PreanestheticPage',
} as ComponentMeta<typeof PreanestheticPage>;

const Template: ComponentStory<typeof PreanestheticPage> = (args) => (
  <PreanestheticPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
