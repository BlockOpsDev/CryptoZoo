import { ComponentStory, ComponentMeta } from '@storybook/react';
import { apolloContext } from '../../../utils/apollo/apollo-decorator';

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
  connected: false,
  keeperBalance: "123,456,789.45",
  zooBalance: "123,456,789.45",
  walletAddress: "0x2d4c407bbe49438ed859fe965b140dcf1aab71a9",
};

export const Connected = Template.bind({});

Connected.args = {
  connected: true,
  keeperBalance: "123,456,789.45",
  zooBalance: "123,456,789.45",
  walletAddress: "0x2d4c407bbe49438ed859fe965b140dcf1aab71a9",
};

