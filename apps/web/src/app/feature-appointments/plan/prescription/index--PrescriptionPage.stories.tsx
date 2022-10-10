import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PrescriptionPage } from './index';

export default {
  component: PrescriptionPage,
  title: 'PrescriptionPage',
} as ComponentMeta<typeof PrescriptionPage>;

const Template: ComponentStory<typeof PrescriptionPage> = (args) => (
  <PrescriptionPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
