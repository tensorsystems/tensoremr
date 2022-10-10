import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PharmacyOrdersList } from './PharmacyOrdersList';

export default {
  component: PharmacyOrdersList,
  title: 'PharmacyOrdersList',
} as ComponentMeta<typeof PharmacyOrdersList>;

const Template: ComponentStory<typeof PharmacyOrdersList> = (args) => (
  <PharmacyOrdersList {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
