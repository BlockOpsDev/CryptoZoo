import { ComponentStory, ComponentMeta } from '@storybook/react';
import { apolloContext } from '../../utils/apollo/apollo-decorator';
import Variants from 'tailwind-config/variants';
import { Button } from './Button';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'radio',
      options: Object.values(Variants),
    },
    onClick: { action: 'clicked' }
  },
  decorators: [apolloContext],
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => (
  <Button {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  title: "Button",
  variant: Variants.Primary,
  loading: false,
};