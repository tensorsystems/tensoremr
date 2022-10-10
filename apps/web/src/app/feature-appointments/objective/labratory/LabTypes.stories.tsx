import { ComponentStory, ComponentMeta } from '@storybook/react';
import { LabTypesComponent } from './LabTypes';

export default {
  component: LabTypesComponent,
  title: 'LabTypesComponent',
} as ComponentMeta<typeof LabTypesComponent>;

const Template: ComponentStory<typeof LabTypesComponent> = (args) => (
  <LabTypesComponent {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
