import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.14',
      },
      {
        version: '0.7.1',
      },
    ],
  },
};

export default config;
