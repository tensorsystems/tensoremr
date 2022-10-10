import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UpdateVisitTypeForm } from './VisitTypesAdminTable';

export default {
  component: UpdateVisitTypeForm,
  title: 'UpdateVisitTypeForm',
} as ComponentMeta<typeof UpdateVisitTypeForm>;

const Template: ComponentStory<typeof UpdateVisitTypeForm> = (args) => (
  <UpdateVisitTypeForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
