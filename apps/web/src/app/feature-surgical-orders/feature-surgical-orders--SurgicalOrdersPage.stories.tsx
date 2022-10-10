import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SurgicalOrdersPage } from './feature-surgical-orders';

export default {
  component: SurgicalOrdersPage,
  title: 'SurgicalOrdersPage',
} as ComponentMeta<typeof SurgicalOrdersPage>;

const Template: ComponentStory<typeof SurgicalOrdersPage> = (args) => (
  <SurgicalOrdersPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
