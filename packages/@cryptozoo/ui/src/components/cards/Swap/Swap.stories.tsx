import { ComponentStory, ComponentMeta } from '@storybook/react';
import { apolloContext } from '../../../utils/apollo/apollo-decorator';

import { Swap } from './Swap';

export default {
  title: 'Cards/Swap',
  component: Swap,
  decorators: [apolloContext],
} as ComponentMeta<typeof Swap>;

const Template: ComponentStory<typeof Swap> = (args) => (
  <Swap {...args} />
);

export const Primary = Template.bind({});

Primary.args = {};
