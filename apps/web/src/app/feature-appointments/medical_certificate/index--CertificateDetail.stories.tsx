import { ComponentStory, ComponentMeta } from '@storybook/react';
import { CertificateDetail } from './index';

export default {
  component: CertificateDetail,
  title: 'CertificateDetail',
} as ComponentMeta<typeof CertificateDetail>;

const Template: ComponentStory<typeof CertificateDetail> = (args) => (
  <CertificateDetail {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
