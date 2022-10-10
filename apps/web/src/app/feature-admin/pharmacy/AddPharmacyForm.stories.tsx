import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AddPharmacyForm } from './AddPharmacyForm';

export default {
  component: AddPharmacyForm,
  title: 'AddPharmacyForm',
  argTypes: {
    onSuccess: { action: 'onSuccess executed!' },
    onError: { action: 'onError executed!' },
    onCancel: { action: 'onCancel executed!' },
  },
} as ComponentMeta<typeof AddPharmacyForm>;

const Template: ComponentStory<typeof AddPharmacyForm> = (args) => (
  <AddPharmacyForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
