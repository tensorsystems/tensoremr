import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UpdateAllergyForm } from './UpdateAllergyForm';

export default {
  component: UpdateAllergyForm,
  title: 'UpdateAllergyForm',
} as ComponentMeta<typeof UpdateAllergyForm>;

const Template: ComponentStory<typeof UpdateAllergyForm> = (args) => (
  <UpdateAllergyForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
