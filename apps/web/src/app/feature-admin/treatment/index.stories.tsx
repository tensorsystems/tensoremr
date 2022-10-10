import { ComponentStory, ComponentMeta } from '@storybook/react';
import { TreatmentTypePage } from './index';

export default {
  component: TreatmentTypePage,
  title: 'TreatmentTypePage',
} as ComponentMeta<typeof TreatmentTypePage>;

const Template: ComponentStory<typeof TreatmentTypePage> = (args) => (
  <TreatmentTypePage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
