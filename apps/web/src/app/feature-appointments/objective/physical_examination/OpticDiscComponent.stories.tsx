import { ComponentStory, ComponentMeta } from '@storybook/react';
import { OpticDiscComponent } from './OpticDiscComponent';

export default {
  component: OpticDiscComponent,
  title: 'OpticDiscComponent',
} as ComponentMeta<typeof OpticDiscComponent>;

const Template: ComponentStory<typeof OpticDiscComponent> = (args) => (
  <OpticDiscComponent {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
