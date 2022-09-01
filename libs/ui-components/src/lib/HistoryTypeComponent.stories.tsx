import { ComponentStory, ComponentMeta } from '@storybook/react';
import { HistoryTypeComponent } from './HistoryTypeComponent';

export default {
  component: HistoryTypeComponent,
  title: 'HistoryTypeComponent',
} as ComponentMeta<typeof HistoryTypeComponent>;

const Template: ComponentStory<typeof HistoryTypeComponent> = (args) => (
  <HistoryTypeComponent {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
