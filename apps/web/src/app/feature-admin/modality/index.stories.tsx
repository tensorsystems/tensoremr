import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ModalityAdminPage } from './index';

export default {
  component: ModalityAdminPage,
  title: 'ModalityAdminPage',
} as ComponentMeta<typeof ModalityAdminPage>;

const Template: ComponentStory<typeof ModalityAdminPage> = (args) => (
  <ModalityAdminPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
