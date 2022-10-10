import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SaveAdministrativeForm } from './SaveAdministrativeForm';

export default {
  component: SaveAdministrativeForm,
  title: 'SaveAdministrativeForm',
} as ComponentMeta<typeof SaveAdministrativeForm>;

const Template: ComponentStory<typeof SaveAdministrativeForm> = (args) => (
  <SaveAdministrativeForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
