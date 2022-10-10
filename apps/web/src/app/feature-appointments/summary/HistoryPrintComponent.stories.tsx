import { ComponentStory, ComponentMeta } from '@storybook/react';
import { HistoryPrintComponent } from './HistoryPrintComponent';

export default {
  component: HistoryPrintComponent,
  title: 'HistoryPrintComponent',
} as ComponentMeta<typeof HistoryPrintComponent>;

const Template: ComponentStory<typeof HistoryPrintComponent> = (args) => (
  <HistoryPrintComponent {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
