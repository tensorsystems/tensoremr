import { ComponentStory, ComponentMeta } from '@storybook/react';
import { InfoBlock } from './PatientInfoBlock';

export default {
  component: InfoBlock,
  title: 'InfoBlock',
} as ComponentMeta<typeof InfoBlock>;

const Template: ComponentStory<typeof InfoBlock> = (args) => (
  <InfoBlock {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
