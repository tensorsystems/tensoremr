import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AddSurgicalProcedureTypeForm } from './AddSurgicalProcedureTypeForm';

export default {
  component: AddSurgicalProcedureTypeForm,
  title: 'AddSurgicalProcedureTypeForm',
} as ComponentMeta<typeof AddSurgicalProcedureTypeForm>;

const Template: ComponentStory<typeof AddSurgicalProcedureTypeForm> = (
  args
) => <AddSurgicalProcedureTypeForm {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
