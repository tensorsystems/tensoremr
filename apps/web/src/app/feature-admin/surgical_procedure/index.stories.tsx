import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SurgicalProcedureTypesPage } from './index';

export default {
  component: SurgicalProcedureTypesPage,
  title: 'SurgicalProcedureTypesPage',
} as ComponentMeta<typeof SurgicalProcedureTypesPage>;

const Template: ComponentStory<typeof SurgicalProcedureTypesPage> = (args) => (
  <SurgicalProcedureTypesPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
