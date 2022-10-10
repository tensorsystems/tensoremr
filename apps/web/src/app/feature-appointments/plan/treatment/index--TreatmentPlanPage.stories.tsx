import { ComponentStory, ComponentMeta } from '@storybook/react';
import { TreatmentPlanPage } from './index';

export default {
  component: TreatmentPlanPage,
  title: 'TreatmentPlanPage',
} as ComponentMeta<typeof TreatmentPlanPage>;

const Template: ComponentStory<typeof TreatmentPlanPage> = (args) => (
  <TreatmentPlanPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
