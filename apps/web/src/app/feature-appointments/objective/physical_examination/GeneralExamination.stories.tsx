import { ComponentStory, ComponentMeta } from '@storybook/react';
import { GeneralExamination } from './GeneralExamination';

export default {
  component: GeneralExamination,
  title: 'GeneralExamination',
} as ComponentMeta<typeof GeneralExamination>;

const Template: ComponentStory<typeof GeneralExamination> = (args) => (
  <GeneralExamination {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
