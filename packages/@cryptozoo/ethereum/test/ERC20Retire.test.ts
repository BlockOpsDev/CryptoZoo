import { expect } from 'chai';
import { deploy_MockERC20Retire } from '../scripts/contract-utils/ERC20Retire';
import { ether, wallets, Wallets } from '../scripts/Utils';

import { MockERC20Retire } from '../typechain-types';

const startingBalance = '2000';
const retireAmount = '324.56';

describe('Retire Token', function () {
  //Account Address
  let accounts: Wallets;

  let token: MockERC20Retire;

  beforeEach('Deploy Token & Mint', async () => {
    accounts = await wallets();

    token = await deploy_MockERC20Retire(accounts.czDeployer, 'Retire', 'RTE');

    await token.connect(accounts.trader1).mint(ether(startingBalance));
  });

  describe('Retire', function () {
    it('Should have Intial Supply', async () => {
      expect(await token.totalSupply()).to.equal(ether(startingBalance));
      expect(await token.circulatingSupply()).to.equal(ether(startingBalance));
    });

    it('Should Retire', async () => {
      expect(await token.totalSupply()).to.equal(ether(startingBalance));

      await expect(token.connect(accounts.trader1).retire(ether(retireAmount)))
        .to.emit(token, 'Retire')
        .withArgs(accounts.trader1.address, ether(retireAmount))
        .to.changeTokenBalances(token, [accounts.trader1, token], [ether(retireAmount).mul(-1), ether(retireAmount)]);

      expect(await token.circulatingSupply()).to.equal(ether(startingBalance).sub(ether(retireAmount)));
    });

    it('Should Retire through transfer', async () => {
      expect(await token.totalSupply()).to.equal(ether(startingBalance));

      await expect(token.connect(accounts.trader1).transfer(token.address, ether(retireAmount)))
        .to.emit(token, 'Retire')
        .withArgs(accounts.trader1.address, ether(retireAmount))
        .to.changeTokenBalances(token, [accounts.trader1, token], [ether(retireAmount).mul(-1), ether(retireAmount)]);

      expect(await token.circulatingSupply()).to.equal(ether(startingBalance).sub(ether(retireAmount)));
    });
  });
});
