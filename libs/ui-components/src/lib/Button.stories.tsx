import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Button } from './Button';

export default {
  component: Button,
  title: 'Button',
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  text: 'Save',
  icon: 'save',
  variant: 'filled',
  pill: true,
  type: 'button',
};

export const NoIcon = Template.bind({});
NoIcon.args = {
  text: 'Save',
  variant: 'filled',
  type: 'button',
};

export const Disabled = Template.bind({});
Disabled.args = {
  text: 'Save',
  disabled: true,
  variant: 'filled',
  pill: true,
  type: 'button',
};

export const Loading = Template.bind({});
Loading.args = {
  text: 'Save',
  icon: 'save',
  loading: true,
  variant: 'filled',
  pill: true,
  type: 'button',
};

export const LoadingText = Template.bind({});
LoadingText.args = {
  text: 'Save',
  icon: 'save',
  loading: true,
  loadingText: 'Saving',
  variant: 'filled',
  pill: true,
  type: 'button',
};

export const Outline = Template.bind({});
Outline.args = {
  text: 'Save',
  icon: 'save',
  variant: 'outline',
  loading: false,
  pill: true,
  type: 'button',
};
