import { ComponentStory, ComponentMeta } from '@storybook/react';
import { OcularMotilityComponent } from './OcularMotilityComponent';

export default {
  component: OcularMotilityComponent,
  title: 'OcularMotilityComponent',
} as ComponentMeta<typeof OcularMotilityComponent>;

const Template: ComponentStory<typeof OcularMotilityComponent> = (args) => (
  <OcularMotilityComponent {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
