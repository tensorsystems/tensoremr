import type { ComponentStory, ComponentMeta } from "@storybook/react";
import SlotFinder from "./slot-finder";

const Story: ComponentMeta<typeof SlotFinder> = {
  component: SlotFinder,
  title: "SlotFinder",
};
export default Story;

const Template: ComponentStory<typeof SlotFinder> = (args) => (
  <SlotFinder {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
