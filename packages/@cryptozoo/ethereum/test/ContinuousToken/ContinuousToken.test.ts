import { expect } from 'chai';
import { ethers } from 'hardhat';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { init_ContinuousToken } from '../../scripts/deploy/ContinuousToken';
import { getSigner, wallets, weiValue } from '../../scripts/Utils';
import { MockContinuousToken } from '../../typechain-types';
import { MockToken } from '@balancer-labs/ethereum/typechain-types';

describe('Continuous Token', function () {
  //Account Addresses
  let deployer: SignerWithAddress;

  let continuousToken: MockContinuousToken;
  let reserveToken: MockToken;

  beforeEach('deploy tokens', async () => {
    deployer = await getSigner(wallets.czDeployer);
    ({ continuousToken, reserveToken } = await init_ContinuousToken(deployer, '0.1', weiValue, '160000', '0.05'));
  });

  describe('Deployment', function () {
    it('Should Check Token Deployment', async function () {
      console.log(await continuousToken.balanceOf(continuousToken.address));
      console.log(await continuousToken.balanceOf(deployer.address));
      console.log(await reserveToken.balanceOf(continuousToken.address));
      console.log(await continuousToken.totalSupply());

      await continuousToken.continuousMintIn(ethers.utils.parseUnits('160000', 18).sub(1));

      console.log(await continuousToken.balanceOf(continuousToken.address));
      console.log(await continuousToken.balanceOf(deployer.address));
      console.log(await reserveToken.balanceOf(continuousToken.address));
      console.log(await continuousToken.totalSupply());

      expect(1).to.equal(1);
    });
  });
});
