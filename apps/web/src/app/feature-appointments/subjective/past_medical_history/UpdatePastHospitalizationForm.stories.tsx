import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UpdatePastHospitalizationForm } from './UpdatePastHospitalizationForm';

export default {
  component: UpdatePastHospitalizationForm,
  title: 'UpdatePastHospitalizationForm',
} as ComponentMeta<typeof UpdatePastHospitalizationForm>;

const Template: ComponentStory<typeof UpdatePastHospitalizationForm> = (
  args
) => <UpdatePastHospitalizationForm {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
