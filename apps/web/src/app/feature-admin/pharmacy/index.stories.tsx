import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PharmacyAdminPage } from './index';

export default {
  component: PharmacyAdminPage,
  title: 'PharmacyAdminPage',
} as ComponentMeta<typeof PharmacyAdminPage>;

const Template: ComponentStory<typeof PharmacyAdminPage> = (args) => (
  <PharmacyAdminPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
