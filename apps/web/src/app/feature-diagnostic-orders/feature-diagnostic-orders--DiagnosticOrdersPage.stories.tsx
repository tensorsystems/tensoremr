import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DiagnosticOrdersPage } from './feature-diagnostic-orders';

export default {
  component: DiagnosticOrdersPage,
  title: 'DiagnosticOrdersPage',
} as ComponentMeta<typeof DiagnosticOrdersPage>;

const Template: ComponentStory<typeof DiagnosticOrdersPage> = (args) => (
  <DiagnosticOrdersPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
