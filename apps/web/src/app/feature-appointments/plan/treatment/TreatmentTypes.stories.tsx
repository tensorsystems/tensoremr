import { ComponentStory, ComponentMeta } from '@storybook/react';
import { TreatmentTypesComponent } from './TreatmentTypes';

export default {
  component: TreatmentTypesComponent,
  title: 'TreatmentTypesComponent',
} as ComponentMeta<typeof TreatmentTypesComponent>;

const Template: ComponentStory<typeof TreatmentTypesComponent> = (args) => (
  <TreatmentTypesComponent {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
