import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Allergies } from './index';

export default {
  component: Allergies,
  title: 'Allergies',
} as ComponentMeta<typeof Allergies>;

const Template: ComponentStory<typeof Allergies> = (args) => (
  <Allergies {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
