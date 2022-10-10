import { ComponentStory, ComponentMeta } from '@storybook/react';
import { LabTypePage } from './index';

export default {
  component: LabTypePage,
  title: 'LabTypePage',
} as ComponentMeta<typeof LabTypePage>;

const Template: ComponentStory<typeof LabTypePage> = (args) => (
  <LabTypePage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
