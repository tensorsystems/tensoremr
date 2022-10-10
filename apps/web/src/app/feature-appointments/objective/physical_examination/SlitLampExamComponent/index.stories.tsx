import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SlitLampExamComponent } from './index';

export default {
  component: SlitLampExamComponent,
  title: 'SlitLampExamComponent',
} as ComponentMeta<typeof SlitLampExamComponent>;

const Template: ComponentStory<typeof SlitLampExamComponent> = (args) => (
  <SlitLampExamComponent {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
