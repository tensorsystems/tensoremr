import { ComponentStory, ComponentMeta } from '@storybook/react';
import { OcularMotilityOdDiagram } from './index';

export default {
  component: OcularMotilityOdDiagram,
  title: 'OcularMotilityOdDiagram',
} as ComponentMeta<typeof OcularMotilityOdDiagram>;

const Template: ComponentStory<typeof OcularMotilityOdDiagram> = (args) => (
  <OcularMotilityOdDiagram {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
