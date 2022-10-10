import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DiagnosisList } from './DiagnosisList';

export default {
  component: DiagnosisList,
  title: 'DiagnosisList',
} as ComponentMeta<typeof DiagnosisList>;

const Template: ComponentStory<typeof DiagnosisList> = (args) => (
  <DiagnosisList {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
