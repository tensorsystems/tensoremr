import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DrugComponent } from './AddMedicalPrescriptionForm';

export default {
  component: DrugComponent,
  title: 'DrugComponent',
} as ComponentMeta<typeof DrugComponent>;

const Template: ComponentStory<typeof DrugComponent> = (args) => (
  <DrugComponent {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
