import { ComponentStory, ComponentMeta } from '@storybook/react';
import { apolloContext } from '../../../utils/apollo/apollo-decorator';

import { SwapSettings } from './SwapSettings';

export default {
  title: 'Components/SwapSettings',
  component: SwapSettings,
  decorators: [apolloContext],
} as ComponentMeta<typeof SwapSettings>;

const Template: ComponentStory<typeof SwapSettings> = (args) => (
  <SwapSettings {...args} />
);

export const Primary = Template.bind({});

Primary.args = {};
