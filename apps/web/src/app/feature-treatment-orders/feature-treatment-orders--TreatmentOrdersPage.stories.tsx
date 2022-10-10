import { ComponentStory, ComponentMeta } from '@storybook/react';
import { TreatmentOrdersPage } from './feature-treatment-orders';

export default {
  component: TreatmentOrdersPage,
  title: 'TreatmentOrdersPage',
} as ComponentMeta<typeof TreatmentOrdersPage>;

const Template: ComponentStory<typeof TreatmentOrdersPage> = (args) => (
  <TreatmentOrdersPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
