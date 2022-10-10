import { ComponentStory, ComponentMeta } from '@storybook/react';
import { LabPage } from './index';

export default {
  component: LabPage,
  title: 'LabPage',
} as ComponentMeta<typeof LabPage>;

const Template: ComponentStory<typeof LabPage> = (args) => (
  <LabPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
