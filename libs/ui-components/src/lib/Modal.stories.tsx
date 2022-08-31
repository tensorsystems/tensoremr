import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Modal } from './Modal';

export default {
  component: Modal,
  title: 'Modal',
  argTypes: {
    onPositiveClick: { action: 'onPositiveClick executed!' },
    onNegativeClick: { action: 'onNegativeClick executed!' },
    onClose: { action: 'onClose executed!' },
  },
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = (args) => <Modal {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  open: false,
  title: '',
  positive: '',
  negative: '',
};
