import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MedicalCertificatePage } from './index';

export default {
  component: MedicalCertificatePage,
  title: 'MedicalCertificatePage',
} as ComponentMeta<typeof MedicalCertificatePage>;

const Template: ComponentStory<typeof MedicalCertificatePage> = (args) => (
  <MedicalCertificatePage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
