import { ComponentStory, ComponentMeta } from '@storybook/react';
import { HandleWaiverForm } from './index';

export default {
  component: HandleWaiverForm,
  title: 'HandleWaiverForm',
} as ComponentMeta<typeof HandleWaiverForm>;

const Template: ComponentStory<typeof HandleWaiverForm> = (args) => (
  <HandleWaiverForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
