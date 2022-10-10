import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UpdatePatientPage } from './feature-update-patient';

export default {
  component: UpdatePatientPage,
  title: 'UpdatePatientPage',
} as ComponentMeta<typeof UpdatePatientPage>;

const Template: ComponentStory<typeof UpdatePatientPage> = (args) => (
  <UpdatePatientPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
