import { ComponentStory, ComponentMeta } from '@storybook/react';
import { VisualAcuityForm } from './VisualAcuityForm';

export default {
  component: VisualAcuityForm,
  title: 'VisualAcuityForm',
} as ComponentMeta<typeof VisualAcuityForm>;

const Template: ComponentStory<typeof VisualAcuityForm> = (args) => (
  <VisualAcuityForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
