import { ComponentStory, ComponentMeta } from '@storybook/react';
import { LabComponent } from './LabComponent';

export default {
  component: LabComponent,
  title: 'LabComponent',
} as ComponentMeta<typeof LabComponent>;

const Template: ComponentStory<typeof LabComponent> = (args) => (
  <LabComponent {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
