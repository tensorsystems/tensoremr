import { ComponentStory, ComponentMeta } from '@storybook/react';
import { onPrescribeAnother } from './index';

export default {
  component: onPrescribeAnother,
  title: 'onPrescribeAnother',
} as ComponentMeta<typeof onPrescribeAnother>;

const Template: ComponentStory<typeof onPrescribeAnother> = (args) => (
  <onPrescribeAnother {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
