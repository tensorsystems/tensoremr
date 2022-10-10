import { ComponentStory, ComponentMeta } from '@storybook/react';
import { RoomsTable } from './RoomsAdminTable';

export default {
  component: RoomsTable,
  title: 'RoomsTable',
} as ComponentMeta<typeof RoomsTable>;

const Template: ComponentStory<typeof RoomsTable> = (args) => (
  <RoomsTable {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
