import { ComponentStory, ComponentMeta } from '@storybook/react';
import { OcularMotilityOsDiagram } from './index';

export default {
  component: OcularMotilityOsDiagram,
  title: 'OcularMotilityOsDiagram',
} as ComponentMeta<typeof OcularMotilityOsDiagram>;

const Template: ComponentStory<typeof OcularMotilityOsDiagram> = (args) => (
  <OcularMotilityOsDiagram {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
