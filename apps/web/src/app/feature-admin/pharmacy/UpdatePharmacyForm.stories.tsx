import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UpdatePharmacyForm } from './UpdatePharmacyForm';

export default {
  component: UpdatePharmacyForm,
  title: 'UpdatePharmacyForm',
} as ComponentMeta<typeof UpdatePharmacyForm>;

const Template: ComponentStory<typeof UpdatePharmacyForm> = (args) => (
  <UpdatePharmacyForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
