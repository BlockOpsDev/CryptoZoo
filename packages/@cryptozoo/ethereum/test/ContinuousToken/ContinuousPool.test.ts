import { expect } from 'chai';
import { ethers } from 'hardhat';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';

import { MockToken } from '@balancer-labs/ethereum/typechain-types';
import { Vault } from '@balancer-labs/typechain';

import { getSigner, wallets, WEI_VALUE, ZERO_ADDRESS } from '../../scripts/Utils';

import { MockContinuousPool } from '../../typechain-types';
import { init_ContinuousPool } from '../../scripts/mock_deploy/ContinuousPool';

describe.only('Continuous Pool', function () {
  //Account Address
  let deployer: SignerWithAddress;

  let vault: Vault;
  let continuousPool: MockContinuousPool;
  let reserveToken: MockToken;

  beforeEach('deploy tokens', async () => {
    deployer = await getSigner(wallets.czDeployer);
    ({ vault, continuousPool, reserveToken } = await init_ContinuousPool(
      deployer,
      { name: 'Test', symbol: 'T1', reserveRatio: '0.1', minReserve: WEI_VALUE, reserve: '160000', price: '0.05' },

      {
        assetManagers: [ZERO_ADDRESS, ZERO_ADDRESS],
        swapFeePercentage: '10000000000000000',
        pauseWindowDuration: '0',
        bufferPeriodDuration: '0',
        owner: deployer.address,
      }
    ));
  });

  describe('Swaps', function () {
    it('Test', async () => {
      console.log(await continuousPool.getPoolId());
      console.log(await vault.getPoolTokenInfo(await continuousPool.getPoolId(), reserveToken.address));
      console.log(await vault.getPoolTokenInfo(await continuousPool.getPoolId(), continuousPool.address));
      console.log(
        await vault.connect(deployer).swap(
          {
            poolId: await continuousPool.getPoolId(),
            kind: 0,
            assetIn: reserveToken.address,
            assetOut: continuousPool.address,
            amount: '1000000000000000000',
            userData: '0x',
          },
          {
            sender: deployer.address,
            fromInternalBalance: false,
            recipient: deployer.address,
            toInternalBalance: false,
          },
          '0',
          '999999999999999999'
        )
      );
      console.log(continuousPool.address);

      expect(1).to.equal(1);
    });
  });
  // console.log(await reserveToken.balanceOf(deployer.address));
  // await continuousToken.connect(deployer).continuousMintIn(ethers.utils.parseUnits('160000', 18).sub(1));
  // console.log(await continuousToken.balanceOf(deployer.address));
  // continuousToken.continuousMintIn(ethers.utils.parseUnits('160000', 18).sub(1));
  // console.log(continuousToken.balanceOf(continuousToken.address));
  // console.log(await continuousToken.totalSupply());
  // expect(1).to.equal(1);
  // console.log(await continuousToken.totalSupply());
  // expect(1).to.equal(1);
});
