import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AutocompleteInput } from './index';

export default {
  component: AutocompleteInput,
  title: 'AutocompleteInput',
  argTypes: {
    onInputChange: { action: 'onInputChange executed!' },
  },
} as ComponentMeta<typeof AutocompleteInput>;

const Template: ComponentStory<typeof AutocompleteInput> = (args) => (
  <AutocompleteInput {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  name: '',
  field: '',
  type: '',
  uri: '',
  disabled: false,
};
