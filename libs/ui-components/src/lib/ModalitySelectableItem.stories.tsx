import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ModalitySelectableItem } from './ModalitySelectableItem';

export default {
  component: ModalitySelectableItem,
  title: 'ModalitySelectableItem',
} as ComponentMeta<typeof ModalitySelectableItem>;

const Template: ComponentStory<typeof ModalitySelectableItem> = (args) => (
  <ModalitySelectableItem {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
