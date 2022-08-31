import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MenuComponent } from './MenuComponent';

export default {
  component: MenuComponent,
  title: 'MenuComponent',
} as ComponentMeta<typeof MenuComponent>;

const Template: ComponentStory<typeof MenuComponent> = (args) => (
  <MenuComponent {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  title: '',
  color: '',
  rounded: '',
};
