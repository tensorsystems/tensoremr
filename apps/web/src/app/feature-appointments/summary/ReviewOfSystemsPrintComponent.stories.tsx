import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ReviewOfSystemsPrintComponent } from './ReviewOfSystemsPrintComponent';

export default {
  component: ReviewOfSystemsPrintComponent,
  title: 'ReviewOfSystemsPrintComponent',
} as ComponentMeta<typeof ReviewOfSystemsPrintComponent>;

const Template: ComponentStory<typeof ReviewOfSystemsPrintComponent> = (
  args
) => <ReviewOfSystemsPrintComponent {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
