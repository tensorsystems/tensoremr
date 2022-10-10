import { ComponentStory, ComponentMeta } from '@storybook/react';
import { OphthalmologyExamination } from './OphthalmologyExamination';

export default {
  component: OphthalmologyExamination,
  title: 'OphthalmologyExamination',
} as ComponentMeta<typeof OphthalmologyExamination>;

const Template: ComponentStory<typeof OphthalmologyExamination> = (args) => (
  <OphthalmologyExamination {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
