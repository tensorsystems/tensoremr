import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SystemSymptomsList } from './SystemSymptomsList';

export default {
  component: SystemSymptomsList,
  title: 'SystemSymptomsList',
} as ComponentMeta<typeof SystemSymptomsList>;

const Template: ComponentStory<typeof SystemSymptomsList> = (args) => (
  <SystemSymptomsList {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
