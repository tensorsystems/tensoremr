import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ReviewOfSystemsPage } from './index';

export default {
  component: ReviewOfSystemsPage,
  title: 'ReviewOfSystemsPage',
} as ComponentMeta<typeof ReviewOfSystemsPage>;

const Template: ComponentStory<typeof ReviewOfSystemsPage> = (args) => (
  <ReviewOfSystemsPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
