import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PastMedicalHistoryPage } from './index';

export default {
  component: PastMedicalHistoryPage,
  title: 'PastMedicalHistoryPage',
} as ComponentMeta<typeof PastMedicalHistoryPage>;

const Template: ComponentStory<typeof PastMedicalHistoryPage> = (args) => (
  <PastMedicalHistoryPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
