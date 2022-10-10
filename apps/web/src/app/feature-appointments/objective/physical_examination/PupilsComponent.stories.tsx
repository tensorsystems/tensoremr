import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PupilsComponent } from './PupilsComponent';

export default {
  component: PupilsComponent,
  title: 'PupilsComponent',
} as ComponentMeta<typeof PupilsComponent>;

const Template: ComponentStory<typeof PupilsComponent> = (args) => (
  <PupilsComponent {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
