import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SurgicalProcedureTypes } from './SurgicalProcedureTypes';

export default {
  component: SurgicalProcedureTypes,
  title: 'SurgicalProcedureTypes',
} as ComponentMeta<typeof SurgicalProcedureTypes>;

const Template: ComponentStory<typeof SurgicalProcedureTypes> = (args) => (
  <SurgicalProcedureTypes {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
