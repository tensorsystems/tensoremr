import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Form } from './LabComponent';

export default {
  component: Form,
  title: 'Form',
} as ComponentMeta<typeof Form>;

const Template: ComponentStory<typeof Form> = (args) => <Form {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
