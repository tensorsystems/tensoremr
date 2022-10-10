import { ComponentStory, ComponentMeta } from '@storybook/react';
import { TreatmentObjectivePage } from './index';

export default {
  component: TreatmentObjectivePage,
  title: 'TreatmentObjectivePage',
} as ComponentMeta<typeof TreatmentObjectivePage>;

const Template: ComponentStory<typeof TreatmentObjectivePage> = (args) => (
  <TreatmentObjectivePage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
