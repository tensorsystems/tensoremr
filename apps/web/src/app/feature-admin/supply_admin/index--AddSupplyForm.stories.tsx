import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AddSupplyForm } from './index';

export default {
  component: AddSupplyForm,
  title: 'AddSupplyForm',
} as ComponentMeta<typeof AddSupplyForm>;

const Template: ComponentStory<typeof AddSupplyForm> = (args) => (
  <AddSupplyForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
