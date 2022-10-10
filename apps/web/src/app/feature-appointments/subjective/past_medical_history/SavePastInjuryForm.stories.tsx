import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SavePastInjuryForm } from './SavePastInjuryForm';

export default {
  component: SavePastInjuryForm,
  title: 'SavePastInjuryForm',
} as ComponentMeta<typeof SavePastInjuryForm>;

const Template: ComponentStory<typeof SavePastInjuryForm> = (args) => (
  <SavePastInjuryForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
