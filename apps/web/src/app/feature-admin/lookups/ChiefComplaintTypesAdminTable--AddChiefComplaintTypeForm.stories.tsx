import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AddChiefComplaintTypeForm } from './ChiefComplaintTypesAdminTable';

export default {
  component: AddChiefComplaintTypeForm,
  title: 'AddChiefComplaintTypeForm',
} as ComponentMeta<typeof AddChiefComplaintTypeForm>;

const Template: ComponentStory<typeof AddChiefComplaintTypeForm> = (args) => (
  <AddChiefComplaintTypeForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
