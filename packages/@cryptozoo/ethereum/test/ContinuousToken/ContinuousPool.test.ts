import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Decimal } from 'decimal.js';

import { BigNumberish, BigNumber } from '@ethersproject/bignumber';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { PromiseOrValue } from '@balancer-labs/ethereum/typechain-types/common';

import { MockToken, MockWETH } from '@balancer-labs/ethereum/typechain-types';
import { Vault } from '@balancer-labs/typechain';

import { getSigner, WalletList, Wallets, wallets, WEI_VALUE, ZERO_ADDRESS } from '../../scripts/Utils';
import { pickTokens, setupEnvironment, TokenList } from '@balancer-labs/ethereum';
import { math_continuousBurnIn, math_continuousMintIn } from './ContinuousToken.test';

import { MockContinuousPool } from '../../typechain-types';
import { init_ContinuousPool } from '../../scripts/mock_deploy/ContinuousPool';
import {
  IContinuousPool,
  IContinuousToken,
} from '../../typechain-types/contracts/pool-continuous/test/MockContinuousPool';

//Testing Helper Functions
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

  return Number(amount.round()).toLocaleString('fullwide', { useGrouping: false });
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

  before('deploy tokens', async () => {
    accounts = await wallets();

    ({ vault, tokens, weth } = await setupEnvironment(accounts.balDeployer, accounts.balAdmin, [
      accounts.czDeployer,
      accounts.trader1,
      accounts.trader2,
    ]));

    reserveToken = pickTokens(tokens, 1)[0];

    ({ continuousPool, poolParams, tokenParams } = await init_ContinuousPool(
      accounts.czDeployer,
      vault,
      {
        name: 'Test',
        symbol: 'T1',
        reserveRatio: '0.1',
        reserveToken,
        minReserve: WEI_VALUE,
        reserve: '160000',
        price: '0.05',
      },

      {
        assetManagers: [ZERO_ADDRESS, ZERO_ADDRESS],
        swapFeePercentage: '10000000000000000',
        pauseWindowDuration: '0',
        bufferPeriodDuration: '0',
        owner: accounts.czAdmin.address,
      }
    ));

    continuousPool.connect(accounts.trader1).approve(vault.address, ethers.utils.parseEther('100000000'));
  });

  const swap = async (
    account: SignerWithAddress,
    amount: BigNumber,
    tokenIn: string,
    tokenOut: string
  ): Promise<string> => {
    const error = ethers.utils.parseEther('.00000001');

    const TokenFactory = await ethers.getContractFactory('ERC20');
    const TokenIn = TokenFactory.attach(tokenIn);
    const TokenOut = TokenFactory.attach(tokenOut);

    const currentBalance = await TokenOut.balanceOf(account.address);

    const args = [
      await continuousPool.reserveRatio(),
      await continuousPool.continuousSupply(),
      await continuousPool.virtualReserveBalance(),
      tokenIn == reserveToken.address ? await subtractFee(amount, poolParams.swapFeePercentage) : amount,
    ];

    const returnAmount = bancorMath(
      tokenIn == reserveToken.address ? math_continuousMintIn : math_continuousBurnIn,
      ...args
    );

    await expect(
      vault.connect(account).swap(
        {
          poolId: await continuousPool.getPoolId(),
          kind: 0,
          assetIn: tokenIn,
          assetOut: tokenOut,
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
      )
    ).to.changeTokenBalances(TokenIn, [account, vault.address], [amount.mul(-1), amount]);

    const recieved = (await TokenOut.balanceOf(account.address)).sub(currentBalance);
    expect(
      recieved
        .sub(
          tokenIn == reserveToken.address
            ? returnAmount
            : await subtractFee(ethers.BigNumber.from(returnAmount), poolParams.swapFeePercentage)
        )
        .abs()
    ).to.be.below(error);

    const minimumReserve = bancorMath(
      math_continuousBurnIn,
      ...[
        await continuousPool.reserveRatio(),
        await continuousPool.continuousSupply(),
        await continuousPool.virtualReserveBalance(),
        (await continuousPool.continuousSupply()).sub(await continuousPool.balanceOf(continuousPool.address)),
      ]
    );

    console.log(minimumReserve);
    console.log(`Reserve Balance: ${await reserveToken.balanceOf(account.address)}`);
    console.log(`Continuous Balance: ${await continuousPool.balanceOf(account.address)}`);
    console.log(`Continuous Supply: ${await continuousPool.continuousSupply()}`);
    console.log(`Minimum Reserve: ${await continuousPool.minimumReserveRequired()}`);
    console.log(`Virtual Reserve: ${await continuousPool.virtualReserveBalance()}`);
    console.log(`Reserve: ${await continuousPool.reserveBalance()}`);
    return recieved.toString();
  };

  describe('Pool Interaction', function () {
    it('Intial Pool State', async () => {
      console.log(tokenParams.supply);
      expect(await continuousPool.balanceOf(vault.address)).to.equal(ethers.BigNumber.from(2).pow(112).sub(1));
      // expect(await continuousPool.minimumReserveRequired()).to.equal(0);
      expect(await continuousPool.reserveRatio()).to.equal(tokenParams.reserveRatio);
      expect(await continuousPool.continuousSupply()).to.equal(tokenParams.supply);
      expect(await continuousPool.virtualReserveBalance()).to.equal(tokenParams.minReserve);
      expect(await continuousPool.reserveBalance()).to.equal(0);
    });

    const swapAmount = ethers.utils.parseEther('100');
    let returnAmount: string;

    it('Swap1', async () => {
      returnAmount = await swap(accounts.trader1, swapAmount, reserveToken.address, continuousPool.address);
      // console.log(`Return Amount: ${returnAmount}`);
      // console.log(await reserveToken.balanceOf(accounts.trader1.address));
    });
    it('Swap2', async () => {
      returnAmount = await swap(accounts.trader1, swapAmount, reserveToken.address, continuousPool.address);
      // console.log(`Return Amount: ${returnAmount}`);
      // console.log(await reserveToken.balanceOf(accounts.trader1.address));
    });
    it('Swap3', async () => {
      returnAmount = await swap(
        accounts.trader1,
        ethers.utils.parseEther('1400000'),
        continuousPool.address,
        reserveToken.address
      );
      // console.log(`Return Amount: ${returnAmount}`);
      // console.log(await continuousPool.balanceOf(accounts.trader1.address));
    });
  });
});
