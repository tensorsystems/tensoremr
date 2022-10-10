import { ComponentStory, ComponentMeta } from '@storybook/react';
import { handleViewAllDocumentClick } from './index';

export default {
  component: handleViewAllDocumentClick,
  title: 'handleViewAllDocumentClick',
} as ComponentMeta<typeof handleViewAllDocumentClick>;

const Template: ComponentStory<typeof handleViewAllDocumentClick> = (args) => (
  <handleViewAllDocumentClick {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
