import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UpdateChiefComplaintTypeForm } from './ChiefComplaintTypesAdminTable';

export default {
  component: UpdateChiefComplaintTypeForm,
  title: 'UpdateChiefComplaintTypeForm',
} as ComponentMeta<typeof UpdateChiefComplaintTypeForm>;

const Template: ComponentStory<typeof UpdateChiefComplaintTypeForm> = (
  args
) => <UpdateChiefComplaintTypeForm {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
