import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from 'hardhat';
import { expect } from 'chai';
import { wallets } from '@cryptozoo/ethereum/scripts/Utils';

import { deploy_keeperTestEnviroment } from '../scripts/keeper';

const SetupParams = {
  swapFeePercentage: '1000000000000',
  reserveRatio: '0.1',
  reservePoint: '160000',
  pricePoint: '0.05',
};

describe('Keeper', function () {
  async function keeperEnviromentFixture() {
    const accounts = await wallets();
    const traders = [accounts.czDeployer, accounts.trader1, accounts.trader2];

    const keeperENV = await deploy_keeperTestEnviroment(SetupParams, traders);

    return { keeperENV, accounts, traders };
  }

  describe('Intial State', function () {
    it('Keeper Initialized', async function () {
      const { keeperENV } = await loadFixture(keeperEnviromentFixture);

      expect(await keeperENV.keeper.totalSupply()).to.equal(keeperENV.initSupply);
      expect(await keeperENV.keeper.balanceOf(keeperENV.keeperOffering.address)).to.equal(keeperENV.initSupply);
    });

    it('Keeper Offering Initialized', async function () {
      const { keeperENV } = await loadFixture(keeperEnviromentFixture);

      expect(await keeperENV.keeperOffering.reserveRatio()).to.equal(
        ethers.utils.parseUnits(SetupParams.reserveRatio, 6)
      );
      expect(await keeperENV.keeperOffering.virtualSupply()).to.equal(keeperENV.initSupply);
      expect(await keeperENV.keeperOffering.virtualReserveBalance()).to.equal(1);
      expect(await keeperENV.keeperOffering.reserveBalance()).to.equal(0);

      console.log(await keeperENV.keeperOffering.minimumReserveRequired());
    });
  });
});
