import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UpdateSurgicalProcedureTypeForm } from './UpdateSurgicalProcedureTypeForm';

export default {
  component: UpdateSurgicalProcedureTypeForm,
  title: 'UpdateSurgicalProcedureTypeForm',
} as ComponentMeta<typeof UpdateSurgicalProcedureTypeForm>;

const Template: ComponentStory<typeof UpdateSurgicalProcedureTypeForm> = (
  args
) => <UpdateSurgicalProcedureTypeForm {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
