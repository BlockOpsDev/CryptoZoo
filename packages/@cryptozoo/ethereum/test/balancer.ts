// import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
// import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs';
import { expect } from 'chai';
// import { ethers } from 'hardhat';
import { Vault } from '@balancer-labs/typechain';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { TokenList, setupEnvironment, pickTokens } from '../balancer';
import { MockToken } from '../typechain-types';

describe('Balancer', function () {
  let vault: Vault;
  let tokenList: TokenList;
  let tokens: MockToken[];
  let deployer: SignerWithAddress;
  let liquidityProvider: SignerWithAddress;
  let trader: SignerWithAddress;

  beforeEach('deploy tokens', async () => {
    ({ vault, tokens: tokenList, deployer, trader, liquidityProvider } = await setupEnvironment());
    tokens = pickTokens(tokenList, 2);
  });

  describe('Deployment', function () {
    // console.log(tokenAddresses);
    it('Should Check Balancer Deployment', async function () {
      console.log(await tokens[1].symbol());
      // const { reserveToken, continousToken } = await loadFixture(deployContinuousTokenAndReserve);

      // expect(await reserveToken.balanceOf(continousToken.address)).to.equal(ethers.utils.parseEther('160000'));

      expect(1).to.equal(1);
    });
  });
});
