import { ComponentStory, ComponentMeta } from '@storybook/react';
import { RefractionInput } from './RefractionInput';

export default {
  component: RefractionInput,
  title: 'RefractionInput',
  argTypes: {
    onChange: { action: 'onChange executed!' },
  },
} as ComponentMeta<typeof RefractionInput>;

const Template: ComponentStory<typeof RefractionInput> = (args) => (
  <RefractionInput {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  name: '',
};
