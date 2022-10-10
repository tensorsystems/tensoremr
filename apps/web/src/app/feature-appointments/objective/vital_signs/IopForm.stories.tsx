import { ComponentStory, ComponentMeta } from '@storybook/react';
import { IopForm } from './IopForm';

export default {
  component: IopForm,
  title: 'IopForm',
} as ComponentMeta<typeof IopForm>;

const Template: ComponentStory<typeof IopForm> = (args) => (
  <IopForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
