import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AddVisitTypeForm } from './VisitTypesAdminTable';

export default {
  component: AddVisitTypeForm,
  title: 'AddVisitTypeForm',
} as ComponentMeta<typeof AddVisitTypeForm>;

const Template: ComponentStory<typeof AddVisitTypeForm> = (args) => (
  <AddVisitTypeForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
