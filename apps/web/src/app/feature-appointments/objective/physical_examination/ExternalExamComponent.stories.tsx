import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ExternalExamComponent } from './ExternalExamComponent';

export default {
  component: ExternalExamComponent,
  title: 'ExternalExamComponent',
} as ComponentMeta<typeof ExternalExamComponent>;

const Template: ComponentStory<typeof ExternalExamComponent> = (args) => (
  <ExternalExamComponent {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
