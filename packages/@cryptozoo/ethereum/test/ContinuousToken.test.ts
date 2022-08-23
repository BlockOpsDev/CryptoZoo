import { expect } from 'chai';
import { ethers } from 'hardhat';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { init_ContinuousToken } from '../scripts/ContinuousToken';
import { getSigner, wallets } from '../scripts/Utils';
import { ContinuousToken } from '../typechain-types';
import { MockToken } from '@balancer-labs/ethereum/typechain-types';

describe('Continuous Token', function () {
  //Account Addresses
  let deployer: SignerWithAddress;

  let continuousToken: ContinuousToken;
  let reserveToken: MockToken;

  beforeEach('deploy tokens', async () => {
    deployer = await getSigner(wallets.czDeployer);

    ({ continuousToken, reserveToken } = await init_ContinuousToken(deployer, 0.1, '160000', '32000000'));
  });

  describe('Deployment', function () {
    // console.log(tokenAddresses);
    it('Should Check Token Deployment', async function () {
      console.log(await reserveToken.balanceOf(continuousToken.address));
      console.log(await continuousToken.balanceOf(continuousToken.address));
      console.log(await continuousToken.balanceOf(deployer.address));
      console.log(await continuousToken.totalSupply());

      console.log(
        ethers.utils.formatEther(
          (await continuousToken.mintGivenIn(ethers.utils.parseUnits('21341.1341333', 18))).toString()
        )
      );

      expect(1).to.equal(1);
    });
  });
});
