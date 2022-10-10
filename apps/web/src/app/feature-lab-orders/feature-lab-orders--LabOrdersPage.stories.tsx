import { ComponentStory, ComponentMeta } from '@storybook/react';
import { LabOrdersPage } from './feature-lab-orders';

export default {
  component: LabOrdersPage,
  title: 'LabOrdersPage',
} as ComponentMeta<typeof LabOrdersPage>;

const Template: ComponentStory<typeof LabOrdersPage> = (args) => (
  <LabOrdersPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
