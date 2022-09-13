import { expect } from 'chai';
import { ethers } from 'hardhat';
import { ether, Wallets, wallets, WEI_VALUE, ZERO_ADDRESS } from '../scripts/Utils';
import { Decimal } from 'decimal.js';

import { MaxUint256 } from '@ethersproject/constants';
import { BigNumberish, BigNumber } from '@ethersproject/bignumber';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { PromiseOrValue } from '@balancer-labs/ethereum/typechain-types/common';

import { MockToken, MockWETH } from '@balancer-labs/ethereum/typechain-types';
import { Vault } from '@balancer-labs/typechain';
import { ERC20Issuable, MockContinuousTokenOfferingPool } from '../typechain-types';
import { ContinuousTokenOfferingPool } from '../typechain-types/contracts/ContinuousTokenOfferingPool/test/MockContinuousTokenOfferingPool';

import { pickTokens, setupEnvironment, TokenList } from '@balancer-labs/ethereum';
import { setupEnviroment_MockContinuousTokenOfferingPool } from '../scripts/mock_deploy/CTOPool';
import { TokenInitialVals } from '../scripts/mock_deploy/SwapIssuer';
import { math_IssueIn, math_IssueOut, math_RedeemIn, math_RedeemOut } from './SwapIssuer.math.test';

export enum SwapKind {
  GIVEN_IN,
  GIVEN_OUT,
}

//Testing Helper Functions
const addFee = (swapAmount: BigNumber | Decimal, swapFeePercentage: PromiseOrValue<BigNumberish>): string => {
  return swapAmount
    .mul(ether('1').toString())
    .sub('1')
    .div(ether('1').sub(swapFeePercentage.toString()).toString())
    .add('1')
    .toString();
};

const subtractFee = (swapAmount: BigNumber | Decimal, swapFeePercentage: PromiseOrValue<BigNumberish>): string => {
  return swapAmount
    .sub(swapAmount.mul(swapFeePercentage.toString()).sub(1).div(ether('1').toString()).add(1).toString())
    .toString();
};

describe('Continous Token Offering Pool', function () {
  //Account Address
  let accounts: Wallets;
  let traders: SignerWithAddress[];

  let vault: Vault;
  let tokens: TokenList;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let weth: MockWETH;
  let reserveToken: MockToken;

  let issueToken: ERC20Issuable;
  let CTOPool: MockContinuousTokenOfferingPool;

  let poolParams: ContinuousTokenOfferingPool.PoolParamsStruct;

  let tokenInitialVals: TokenInitialVals;

  const bancorMath = (isIssue: boolean, swapKind: SwapKind, ...args: BigNumber[]): BigNumber => {
    let method: (...args: [...Decimal[]]) => Decimal;
    if (isIssue) {
      if (swapKind == SwapKind.GIVEN_IN) {
        args[3] = BigNumber.from(subtractFee(args[3], poolParams.swapFeePercentage));
        method = math_IssueIn;
      } else {
        method = math_IssueOut;
      }
    } else {
      if (swapKind == SwapKind.GIVEN_OUT) {
        args[3] = BigNumber.from(addFee(args[3], poolParams.swapFeePercentage));
        method = math_RedeemOut;
      } else {
        method = math_RedeemIn;
      }
    }
    // eslint-disable-next-line prefer-spread
    let amount = method.apply(
      null,
      args.map((x) => new Decimal(x.toString()))
    );

    if (isIssue && swapKind == SwapKind.GIVEN_OUT) {
      amount = new Decimal(addFee(amount, poolParams.swapFeePercentage));
    } else if (!isIssue && swapKind == SwapKind.GIVEN_IN) {
      amount = new Decimal(subtractFee(amount, poolParams.swapFeePercentage));
    }
    return BigNumber.from(Number(amount.round()).toLocaleString('fullwide', { useGrouping: false }));
  };

  before('Deploy Tokens & Pool', async () => {
    accounts = await wallets();
    traders = [accounts.czDeployer, accounts.trader1, accounts.trader2];

    ({ vault, tokens, weth } = await setupEnvironment(accounts.balDeployer, accounts.balAdmin, traders));

    reserveToken = pickTokens(tokens, 1)[0];

    ({ issueToken, CTOPool, poolParams, tokenInitialVals } = await setupEnviroment_MockContinuousTokenOfferingPool(
      accounts.czDeployer,
      traders,
      vault.address,
      {
        assetManagers: [ZERO_ADDRESS, ZERO_ADDRESS],
        swapFeePercentage: '100000000000000000',
        pauseWindowDuration: '0',
        bufferPeriodDuration: '0',
        owner: accounts.czAdmin.address,
      },
      '0.1',
      '160000',
      '0.05',
      WEI_VALUE,
      reserveToken
    ));
  });

  const swap = async (
    account: SignerWithAddress,
    error: string,
    tradeAmount: string,
    tokenIn: string,
    tokenOut: string,
    swapKind: SwapKind
  ): Promise<string> => {
    let actual: BigNumber;

    const maxError = ether(error);
    const amount = ether(tradeAmount);

    const isIssue = tokenIn == reserveToken.address;

    const TokenFactory = await ethers.getContractFactory('ERC20');
    const TokenIn = TokenFactory.attach(tokenIn);
    const TokenOut = TokenFactory.attach(tokenOut);

    const currentInBalance = await TokenIn.balanceOf(account.address);
    const currentOutBalance = await TokenOut.balanceOf(account.address);

    const args = [
      BigNumber.from(await CTOPool.reserveRatio()),
      await CTOPool.virtualSupply(),
      await CTOPool.virtualReserveBalance(),
      amount,
    ];

    let expected = bancorMath(isIssue, swapKind, ...args);
    console.log(expected);

    if (swapKind == SwapKind.GIVEN_IN) {
      await expect(
        vault.connect(account).swap(
          {
            poolId: await CTOPool.getPoolId(),
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

      actual = (await TokenOut.balanceOf(account.address)).sub(currentOutBalance);
    } else {
      expected = expected.mul(-1);

      await expect(
        vault.connect(account).swap(
          {
            poolId: await CTOPool.getPoolId(),
            kind: 1,
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
          MaxUint256,
          '999999999999999999'
        )
      ).to.changeTokenBalances(TokenOut, [account, vault.address], [amount, amount.mul(-1)]);

      actual = (await TokenIn.balanceOf(account.address)).sub(currentInBalance);
    }

    console.log(expected);
    console.log(actual);

    console.log(actual.mul(ether('1')).div(expected).sub(ether('1')).abs());

    expect(actual.mul(ether('1')).div(expected).sub(ether('1')).abs()).to.be.below(maxError);

    return actual.toString();
  };

  describe('Pool Interaction', function () {
    it('Intial Pool State', async () => {
      expect(await issueToken.balanceOf(vault.address)).to.equal(
        ethers.BigNumber.from(2).pow(112).sub(1).sub(tokenInitialVals.supply)
      );
      expect(await CTOPool.reserveRatio()).to.equal(tokenInitialVals.reserveRatio);
      expect(await CTOPool.virtualSupply()).to.equal(tokenInitialVals.supply);
      expect(await CTOPool.virtualReserveBalance()).to.equal(tokenInitialVals.minReserve);
      expect(await CTOPool.reserveBalance()).to.equal(0);
    });

    it('Init Swap', async () => {
      await swap(
        accounts.trader1,
        '0.0000000000001',
        '1.11111111111111111',
        reserveToken.address,
        issueToken.address,
        SwapKind.GIVEN_IN
      );
    });
    it('Swap1', async () => {
      await swap(
        accounts.trader1,
        '0.0000000000001',
        '177776.666667',
        reserveToken.address,
        issueToken.address,
        SwapKind.GIVEN_IN
      );
    });
    it('Swap2', async () => {
      await swap(
        accounts.trader1,
        '0.0000000000001',
        '6672.92492567',
        issueToken.address,
        reserveToken.address,
        SwapKind.GIVEN_IN
      );
    });
  });
});
