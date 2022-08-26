import { DecoratorFn } from '@storybook/react';
import { EthersContextProvider } from '@cryptozoo/ethers-context';

export const ethersContext: DecoratorFn = (Story) => {
  return (
    <EthersContextProvider>
      <Story />
    </EthersContextProvider>
  );
};
