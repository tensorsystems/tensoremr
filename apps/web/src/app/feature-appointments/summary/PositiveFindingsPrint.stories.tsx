import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PositiveFindingsPrint } from './PositiveFindingsPrint';

export default {
  component: PositiveFindingsPrint,
  title: 'PositiveFindingsPrint',
} as ComponentMeta<typeof PositiveFindingsPrint>;

const Template: ComponentStory<typeof PositiveFindingsPrint> = (args) => (
  <PositiveFindingsPrint {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
