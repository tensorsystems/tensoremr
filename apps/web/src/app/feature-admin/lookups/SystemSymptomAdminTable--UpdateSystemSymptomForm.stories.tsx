import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UpdateSystemSymptomForm } from './SystemSymptomAdminTable';

export default {
  component: UpdateSystemSymptomForm,
  title: 'UpdateSystemSymptomForm',
} as ComponentMeta<typeof UpdateSystemSymptomForm>;

const Template: ComponentStory<typeof UpdateSystemSymptomForm> = (args) => (
  <UpdateSystemSymptomForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
