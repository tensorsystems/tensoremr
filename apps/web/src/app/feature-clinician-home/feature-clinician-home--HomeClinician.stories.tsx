import { ComponentStory, ComponentMeta } from '@storybook/react';
import { HomeClinician } from './feature-clinician-home';

export default {
  component: HomeClinician,
  title: 'HomeClinician',
} as ComponentMeta<typeof HomeClinician>;

const Template: ComponentStory<typeof HomeClinician> = (args) => (
  <HomeClinician {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
