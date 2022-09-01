import { ComponentStory, ComponentMeta } from '@storybook/react';
import { RefractionNearComponent } from './RefractionNearForm';

export default {
  component: RefractionNearComponent,
  title: 'RefractionNearComponent',
} as ComponentMeta<typeof RefractionNearComponent>;

const Template: ComponentStory<typeof RefractionNearComponent> = (args) => (
  <RefractionNearComponent {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
