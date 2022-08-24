import { ComponentStory, ComponentMeta } from '@storybook/react';
import { apolloContext } from '../../../utils/apollo/apollo-decorator';

import { TokenSelector } from './TokenSelector';

export default {
  title: 'Components/TokenSelector',
  component: TokenSelector,
  decorators: [apolloContext],
} as ComponentMeta<typeof TokenSelector>;

const Template: ComponentStory<typeof TokenSelector> = (args) => (
  <TokenSelector {...args} />
);

export const Primary = Template.bind({});

Primary.args = {};
