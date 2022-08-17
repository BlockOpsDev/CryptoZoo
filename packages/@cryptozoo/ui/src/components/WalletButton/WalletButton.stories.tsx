import { ComponentStory, ComponentMeta } from '@storybook/react';
import { apolloContext } from '../../utils/apollo/apollo-decorator';

import { WalletButton } from './WalletButton';

export default {
  title: 'Components/WalletButton',
  component: WalletButton,
  decorators: [apolloContext],
} as ComponentMeta<typeof WalletButton>;

const Template: ComponentStory<typeof WalletButton> = (args) => (
  <WalletButton {...args} />
);

export const Disconnected = Template.bind({});

Disconnected.args = {
  connected: false
};

export const Connected = Template.bind({});

Connected.args = {
  connected: true
};

