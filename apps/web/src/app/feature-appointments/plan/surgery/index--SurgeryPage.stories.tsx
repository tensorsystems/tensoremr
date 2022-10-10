import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SurgeryPage } from './index';

export default {
  component: SurgeryPage,
  title: 'SurgeryPage',
} as ComponentMeta<typeof SurgeryPage>;

const Template: ComponentStory<typeof SurgeryPage> = (args) => (
  <SurgeryPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
