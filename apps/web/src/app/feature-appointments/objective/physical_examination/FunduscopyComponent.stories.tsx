import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FunduscopyComponent } from './FunduscopyComponent';

export default {
  component: FunduscopyComponent,
  title: 'FunduscopyComponent',
} as ComponentMeta<typeof FunduscopyComponent>;

const Template: ComponentStory<typeof FunduscopyComponent> = (args) => (
  <FunduscopyComponent {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
