import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AccordionItem } from './index';

export default {
  component: AccordionItem,
  title: 'AccordionItem',
} as ComponentMeta<typeof AccordionItem>;

const Template: ComponentStory<typeof AccordionItem> = (args) => (
  <AccordionItem {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
