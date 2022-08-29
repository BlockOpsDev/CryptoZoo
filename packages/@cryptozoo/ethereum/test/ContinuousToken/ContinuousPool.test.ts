import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Decimal } from 'decimal.js';

import { BigNumberish, BigNumber } from '@ethersproject/bignumber';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { PromiseOrValue } from '@balancer-labs/ethereum/typechain-types/common';

import { MockToken, MockWETH } from '@balancer-labs/ethereum/typechain-types';
import { Vault } from '@balancer-labs/typechain';

import { Wallets, wallets, WEI_VALUE, ZERO_ADDRESS } from '../../scripts/Utils';
import { pickTokens, setupEnvironment, TokenList } from '@balancer-labs/ethereum';
import { math_continuousMintIn } from './ContinuousToken.test';

import { MockContinuousPool } from '../../typechain-types';
import { init_ContinuousPool } from '../../scripts/mock_deploy/ContinuousPool';
import {
  IContinuousPool,
  IContinuousToken,
} from '../../typechain-types/contracts/pool-continuous/test/MockContinuousPool';

const subtractFee = (
  swapAmount: BigNumber,
  swapFeePercentage: PromiseOrValue<BigNumberish>
): PromiseOrValue<BigNumberish> => {
  return swapAmount.sub(swapAmount.mul(swapFeePercentage.toString()).sub(1).div(ethers.utils.parseEther('1')).add(1));
};

const bancorMath = (method: (...args: [...Decimal[]]) => Decimal, ...args: PromiseOrValue<BigNumberish>[]): string => {
  // eslint-disable-next-line prefer-spread
  const amount = method.apply(
    null,
    args.map((x) => new Decimal(x.toString()))
  );

  return Number(amount).toLocaleString('fullwide', { useGrouping: false });
};

describe.only('Continuous Pool', function () {
  //Account Address
  let accounts: Wallets;

  let vault: Vault;
  let tokens: TokenList;
  let weth: MockWETH;
  let continuousPool: MockContinuousPool;
  let reserveToken: MockToken;

  let tokenParams: IContinuousToken.TokenParamsStruct;
  let poolParams: IContinuousPool.PoolParamsStruct;

  beforeEach('deploy tokens', async () => {
    accounts = await wallets();

    ({ vault, tokens, weth } = await setupEnvironment(accounts.balDeployer, accounts.balAdmin, [
      accounts.czDeployer,
      accounts.trader,
    ]));

    reserveToken = pickTokens(tokens, 1)[0];

    ({ continuousPool, poolParams, tokenParams } = await init_ContinuousPool(
      accounts.czDeployer,
      vault,
      reserveToken,
      { name: 'Test', symbol: 'T1', reserveRatio: '0.1', minReserve: WEI_VALUE, reserve: '160000', price: '0.05' },

      {
        assetManagers: [ZERO_ADDRESS, ZERO_ADDRESS],
        swapFeePercentage: '10000000000000000',
        pauseWindowDuration: '0',
        bufferPeriodDuration: '0',
        owner: accounts.czAdmin.address,
      }
    ));
  });

  const swap = async (account: SignerWithAddress, amount: BigNumberish) => {
    return vault.connect(account).swap(
      {
        poolId: await continuousPool.getPoolId(),
        kind: 0,
        assetIn: reserveToken.address,
        assetOut: continuousPool.address,
        amount: amount,
        userData: '0x',
      },
      {
        sender: account.address,
        fromInternalBalance: false,
        recipient: account.address,
        toInternalBalance: false,
      },
      '0',
      '999999999999999999'
    );
  };

  describe('Pool Interaction', function () {
    it('Intial Pool State', async () => {
      expect(await continuousPool.reserveRatio()).to.equal(tokenParams.reserveRatio);
      expect(await continuousPool.continuousSupply()).to.equal(tokenParams.supply);
      expect(await continuousPool.virtualReserveBalance()).to.equal(tokenParams.minReserve);
      expect(await continuousPool.reserveBalance()).to.equal(0);
    });

    it('Swap', async () => {
      const error = ethers.utils.parseEther('.000000001');
      const swapAmount = ethers.utils.parseEther('56');

      const args = [
        tokenParams.reserveRatio,
        tokenParams.supply,
        tokenParams.minReserve,
        subtractFee(swapAmount, poolParams.swapFeePercentage),
      ];

      const returnAmount = bancorMath(math_continuousMintIn, ...args);

      await expect(swap(accounts.trader, swapAmount)).to.changeTokenBalances(
        reserveToken,
        [accounts.trader, vault.address],
        [swapAmount.mul(-1), swapAmount]
      );
      expect((await continuousPool.balanceOf(accounts.trader.address)).sub(returnAmount).abs()).to.be.below(error);
    });
  });
});
