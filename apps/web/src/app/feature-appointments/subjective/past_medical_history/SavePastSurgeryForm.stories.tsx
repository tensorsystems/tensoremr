import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SavePastSurgeryForm } from './SavePastSurgeryForm';

export default {
  component: SavePastSurgeryForm,
  title: 'SavePastSurgeryForm',
} as ComponentMeta<typeof SavePastSurgeryForm>;

const Template: ComponentStory<typeof SavePastSurgeryForm> = (args) => (
  <SavePastSurgeryForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
