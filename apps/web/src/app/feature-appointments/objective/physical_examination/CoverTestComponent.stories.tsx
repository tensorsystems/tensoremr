import { ComponentStory, ComponentMeta } from '@storybook/react';
import { CoverTestComponent } from './CoverTestComponent';

export default {
  component: CoverTestComponent,
  title: 'CoverTestComponent',
} as ComponentMeta<typeof CoverTestComponent>;

const Template: ComponentStory<typeof CoverTestComponent> = (args) => (
  <CoverTestComponent {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
