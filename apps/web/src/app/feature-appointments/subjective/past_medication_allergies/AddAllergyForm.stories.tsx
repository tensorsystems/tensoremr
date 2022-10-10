import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AddAllergyForm } from './AddAllergyForm';

export default {
  component: AddAllergyForm,
  title: 'AddAllergyForm',
} as ComponentMeta<typeof AddAllergyForm>;

const Template: ComponentStory<typeof AddAllergyForm> = (args) => (
  <AddAllergyForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
