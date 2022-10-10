import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PastIllnessTypesTable } from './PastIllnessTypeAdminTable';

export default {
  component: PastIllnessTypesTable,
  title: 'PastIllnessTypesTable',
} as ComponentMeta<typeof PastIllnessTypesTable>;

const Template: ComponentStory<typeof PastIllnessTypesTable> = (args) => (
  <PastIllnessTypesTable {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
