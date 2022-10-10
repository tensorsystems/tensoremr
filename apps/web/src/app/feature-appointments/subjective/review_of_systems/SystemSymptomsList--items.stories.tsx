import { ComponentStory, ComponentMeta } from '@storybook/react';
import { items } from './SystemSymptomsList';

export default {
  component: items,
  title: 'items',
} as ComponentMeta<typeof items>;

const Template: ComponentStory<typeof items> = (args) => <items {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
