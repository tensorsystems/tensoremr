import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AccordionTitle } from './index';

export default {
  component: AccordionTitle,
  title: 'AccordionTitle',
} as ComponentMeta<typeof AccordionTitle>;

const Template: ComponentStory<typeof AccordionTitle> = (args) => (
  <AccordionTitle {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
