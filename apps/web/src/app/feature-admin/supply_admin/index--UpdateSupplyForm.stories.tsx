import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UpdateSupplyForm } from './index';

export default {
  component: UpdateSupplyForm,
  title: 'UpdateSupplyForm',
} as ComponentMeta<typeof UpdateSupplyForm>;

const Template: ComponentStory<typeof UpdateSupplyForm> = (args) => (
  <UpdateSupplyForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
