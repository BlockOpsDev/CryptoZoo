import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Wallets, wallets, ZERO_ADDRESS } from '../scripts/Utils';
import { Decimal } from 'decimal.js';

import { BigNumberish, BigNumber } from '@ethersproject/bignumber';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { PromiseOrValue } from '@balancer-labs/ethereum/typechain-types/common';

import { MockToken, MockWETH } from '@balancer-labs/ethereum/typechain-types';
import { Vault } from '@balancer-labs/typechain';
import { ERC20ManagedSupply, MockIssuerPool } from '../typechain-types';
import { IssuerPool } from '../typechain-types/contracts/pool-continuous/test/MockIssuerPool';

import { pickTokens, setupEnvironment, TokenList } from '@balancer-labs/ethereum';
import { setupEnviroment_MockIssuerPool } from '../scripts/mock_deploy/IssuerPool';
import { TokenInitialVals } from '../scripts/mock_deploy/ConstantReserveRatioIssuer';
import { math_IssueIn, math_RedeemIn } from './ConstantReserveRatio.test';

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

describe.only('Issuer Pool', function () {
  //Account Address
  let accounts: Wallets;
  let traders: SignerWithAddress[];

  let vault: Vault;
  let tokens: TokenList;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let weth: MockWETH;
  let reserveToken: MockToken;

  let issueToken: ERC20ManagedSupply;
  let issuerPool: MockIssuerPool;

  let poolParams: IssuerPool.PoolParamsStruct;

  let tokenInitialVals: TokenInitialVals;

  before('deploy tokens', async () => {
    accounts = await wallets();
    traders = [accounts.czDeployer, accounts.trader1, accounts.trader2];

    ({ vault, tokens, weth } = await setupEnvironment(accounts.balDeployer, accounts.balAdmin, traders));

    reserveToken = pickTokens(tokens, 1)[0];

    ({ issueToken, issuerPool, poolParams, tokenInitialVals } = await setupEnviroment_MockIssuerPool(
      accounts.czDeployer,
      traders,
      vault.address,
      {
        assetManagers: [ZERO_ADDRESS, ZERO_ADDRESS],
        swapFeePercentage: '10000000000000000',
        pauseWindowDuration: '0',
        bufferPeriodDuration: '0',
        owner: accounts.czAdmin.address,
      },
      '0.1',
      '160000',
      '0.05',
      reserveToken
    ));
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
      await issuerPool.reserveRatio(),
      await issuerPool.virtualSupply(),
      await issuerPool.virtualReserveBalance(),
      tokenIn == reserveToken.address ? await subtractFee(amount, poolParams.swapFeePercentage) : amount,
    ];

    const returnAmount = bancorMath(tokenIn == reserveToken.address ? math_IssueIn : math_RedeemIn, ...args);

    await expect(
      vault.connect(account).swap(
        {
          poolId: await issuerPool.getPoolId(),
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

    // const minimumReserve = bancorMath(
    //   math_continuousBurnIn,
    //   ...[
    //     await continuousPool.reserveRatio(),
    //     await continuousPool.continuousSupply(),
    //     await continuousPool.virtualReserveBalance(),
    //     (await continuousPool.continuousSupply()).sub(await continuousPool.balanceOf(continuousPool.address)),
    //   ]
    // );

    // console.log(minimumReserve);
    // console.log(`Reserve Balance: ${await reserveToken.balanceOf(account.address)}`);
    // console.log(`Continuous Balance: ${await continuousPool.balanceOf(account.address)}`);
    // console.log(`Continuous Supply: ${await continuousPool.continuousSupply()}`);
    // console.log(`Minimum Reserve: ${await continuousPool.minimumReserveRequired()}`);
    // console.log(`Virtual Reserve: ${await continuousPool.virtualReserveBalance()}`);
    // console.log(`Reserve: ${await continuousPool.reserveBalance()}`);
    return recieved.toString();
  };

  describe('Pool Interaction', function () {
    it('Intial Pool State', async () => {
      expect(await issueToken.balanceOf(vault.address)).to.equal(
        ethers.BigNumber.from(2).pow(112).sub(1).sub(tokenInitialVals.supply)
      );
      // expect(await issuerPool.minimumReserveRequired()).to.equal(0);
      expect(await issuerPool.reserveRatio()).to.equal(tokenInitialVals.reserveRatio);
      expect(await issuerPool.virtualSupply()).to.equal(tokenInitialVals.supply);
      expect(await issuerPool.virtualReserveBalance()).to.equal(tokenInitialVals.minReserve);
      expect(await issuerPool.reserveBalance()).to.equal(0);
    });

    const swapAmount = ethers.utils.parseEther('100');

    it('Swap1', async () => {
      await swap(accounts.trader1, swapAmount, reserveToken.address, issueToken.address);
      // console.log(`Return Amount: ${returnAmount}`);
    });
    it('Swap2', async () => {
      await swap(accounts.trader1, swapAmount, reserveToken.address, issueToken.address);
      // console.log(`Return Amount: ${returnAmount}`);
      // console.log(await reserveToken.balanceOf(accounts.trader1.address));
    });
    it('Swap3', async () => {
      await swap(accounts.trader1, ethers.utils.parseEther('1400000'), issueToken.address, reserveToken.address);
      // console.log(`Return Amount: ${returnAmount}`);
      // console.log(await continuousPool.balanceOf(accounts.trader1.address));
    });
  });
});
