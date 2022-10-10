import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ProgressComponent } from './ProgressComponent';

export default {
  component: ProgressComponent,
  title: 'ProgressComponent',
} as ComponentMeta<typeof ProgressComponent>;

const Template: ComponentStory<typeof ProgressComponent> = (args) => (
  <ProgressComponent {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
