import { ComponentStory, ComponentMeta } from '@storybook/react';
import { IopSideInfo } from './IopSideInfo';

export default {
  component: IopSideInfo,
  title: 'IopSideInfo',
} as ComponentMeta<typeof IopSideInfo>;

const Template: ComponentStory<typeof IopSideInfo> = (args) => (
  <IopSideInfo {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
