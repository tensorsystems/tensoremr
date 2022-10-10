import { ComponentStory, ComponentMeta } from '@storybook/react';
import { CompleteEyewearPrescriptionOrder } from './CompleteEyewearPrescriptionOrder';

export default {
  component: CompleteEyewearPrescriptionOrder,
  title: 'CompleteEyewearPrescriptionOrder',
} as ComponentMeta<typeof CompleteEyewearPrescriptionOrder>;

const Template: ComponentStory<typeof CompleteEyewearPrescriptionOrder> = (
  args
) => <CompleteEyewearPrescriptionOrder {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
