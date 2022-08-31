import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ResultTypeTitle } from './DiagnosticProcedureComponent';

export default {
  component: ResultTypeTitle,
  title: 'ResultTypeTitle',
} as ComponentMeta<typeof ResultTypeTitle>;

const Template: ComponentStory<typeof ResultTypeTitle> = (args) => (
  <ResultTypeTitle {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
