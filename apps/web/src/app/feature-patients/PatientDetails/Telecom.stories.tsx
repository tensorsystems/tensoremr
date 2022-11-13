import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Telecom } from './Telecom';

const Story: ComponentMeta<typeof Telecom> = {
  component: Telecom,
  title: 'Telecom',
};
export default Story;

const Template: ComponentStory<typeof Telecom> = (args) => (
  <Telecom {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  system: "phone",
  value: "+2519444444",
  use: "home"
};

export const Email = Template.bind({});
Email.args = {
  system: "email",
  value: "info@tensorsystems.net",
  use: "home"
}

export const Pager = Template.bind({});
Pager.args = {
  system: "pager",
  value: "info@tensorsystems.net",
  use: "home"
}

export const Url = Template.bind({});
Url.args = {
  system: "url",
  value: "www.tensorsystems.net",
  use: "work"
}

export const Sms = Template.bind({});
Sms.args = {
  system: "sms",
  value: "+251915444444",
  use: "home"
}