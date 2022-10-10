import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MedicationsPage } from './index';

export default {
  component: MedicationsPage,
  title: 'MedicationsPage',
} as ComponentMeta<typeof MedicationsPage>;

const Template: ComponentStory<typeof MedicationsPage> = (args) => (
  <MedicationsPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
