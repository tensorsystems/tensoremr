import { ComponentStory, ComponentMeta } from '@storybook/react';
import { OrganizationDetails } from './index';

export default {
  component: OrganizationDetails,
  title: 'OrganizationDetails',
} as ComponentMeta<typeof OrganizationDetails>;

const Template: ComponentStory<typeof OrganizationDetails> = (args) => (
  <OrganizationDetails {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
