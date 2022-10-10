import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SavePastHospitalizationForm } from './SavePastHospitalizationForm';

export default {
  component: SavePastHospitalizationForm,
  title: 'SavePastHospitalizationForm',
} as ComponentMeta<typeof SavePastHospitalizationForm>;

const Template: ComponentStory<typeof SavePastHospitalizationForm> = (args) => (
  <SavePastHospitalizationForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
