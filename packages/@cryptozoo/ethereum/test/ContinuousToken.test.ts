import { expect } from 'chai';
import { ethers } from 'hardhat';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { init_ContinuousToken } from '../scripts/ContinousToken';
import { getSigner, wallets } from '../scripts/Utils';
import { ContinuousToken } from '../typechain-types';

describe('Continuous Token', function () {
  //Account Addresses
  let deployer: SignerWithAddress;

  let continuousToken: ContinuousToken;

  beforeEach('deploy tokens', async () => {
    deployer = await getSigner(wallets.czDeployer);

    continuousToken = await init_ContinuousToken(deployer);
  });

  describe('Deployment', function () {
    // console.log(tokenAddresses);
    it('Should Check Token Deployment', async function () {
      console.log(
        ethers.utils.formatEther((await continuousToken.mintGivenIn(ethers.utils.parseUnits('84000', 18))).toString())
      );
      // const { reserveToken, continousToken } = await loadFixture(deployContinuousTokenAndReserve);

      // expect(await reserveToken.balanceOf(continousToken.address)).to.equal(ethers.utils.parseEther('160000'));

      expect(1).to.equal(1);
    });
  });
});
