import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SaveSocialHistoryForm } from './SaveSocialHistoryForm';

export default {
  component: SaveSocialHistoryForm,
  title: 'SaveSocialHistoryForm',
} as ComponentMeta<typeof SaveSocialHistoryForm>;

const Template: ComponentStory<typeof SaveSocialHistoryForm> = (args) => (
  <SaveSocialHistoryForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
