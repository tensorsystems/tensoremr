import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SaveHospitalizationHistoryForm } from './SaveHospitalizationHistoryForm';

export default {
  component: SaveHospitalizationHistoryForm,
  title: 'SaveHospitalizationHistoryForm',
} as ComponentMeta<typeof SaveHospitalizationHistoryForm>;

const Template: ComponentStory<typeof SaveHospitalizationHistoryForm> = (
  args
) => <SaveHospitalizationHistoryForm {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
