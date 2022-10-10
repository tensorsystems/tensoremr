import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SaveClinicalFindingHistoryForm } from './SaveClinicalFindingHistoryForm';

export default {
  component: SaveClinicalFindingHistoryForm,
  title: 'SaveClinicalFindingHistoryForm',
} as ComponentMeta<typeof SaveClinicalFindingHistoryForm>;

const Template: ComponentStory<typeof SaveClinicalFindingHistoryForm> = (
  args
) => <SaveClinicalFindingHistoryForm {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
