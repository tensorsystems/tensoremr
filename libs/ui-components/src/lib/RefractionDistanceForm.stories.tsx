import { ComponentStory, ComponentMeta } from '@storybook/react';
import { RefractionDistanceComponent } from './RefractionDistanceForm';

export default {
  component: RefractionDistanceComponent,
  title: 'RefractionDistanceComponent',
} as ComponentMeta<typeof RefractionDistanceComponent>;

const Template: ComponentStory<typeof RefractionDistanceComponent> = (args) => (
  <RefractionDistanceComponent {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
