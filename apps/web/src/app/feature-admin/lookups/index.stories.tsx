import { ComponentStory, ComponentMeta } from '@storybook/react';
import { LookupsAdminPage } from './index';

export default {
  component: LookupsAdminPage,
  title: 'LookupsAdminPage',
} as ComponentMeta<typeof LookupsAdminPage>;

const Template: ComponentStory<typeof LookupsAdminPage> = (args) => (
  <LookupsAdminPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
