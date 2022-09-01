import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PrescriptionOrdersToolbar } from './PrescriptionOrdersToolbar';

export default {
  component: PrescriptionOrdersToolbar,
  title: 'PrescriptionOrdersToolbar',
} as ComponentMeta<typeof PrescriptionOrdersToolbar>;

const Template: ComponentStory<typeof PrescriptionOrdersToolbar> = (args) => (
  <PrescriptionOrdersToolbar {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
