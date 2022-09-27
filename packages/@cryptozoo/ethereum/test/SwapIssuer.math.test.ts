import { assert } from 'chai';
import { Decimal } from 'decimal.js';
import { Wallets, wallets, WEI_VALUE } from '../scripts/Utils';

import { MockSwapIssuer } from '../typechain-types';
import { setupEnviroment_MockSwapIssuer } from '../scripts/contract-utils/SwapIssuer';

const ONE = new Decimal(1);
const MAX_WEIGHT = new Decimal(1000000);

export const math_IssueIn = (reserveRatio: Decimal, supply: Decimal, balance: Decimal, amount: Decimal) =>
  supply.mul(ONE.add(amount.div(balance)).pow(reserveRatio.div(MAX_WEIGHT)).sub(ONE));

export const math_IssueOut = (reserveRatio: Decimal, supply: Decimal, balance: Decimal, amount: Decimal) =>
  balance.mul(supply.add(amount).div(supply).pow(MAX_WEIGHT.div(reserveRatio)).sub(ONE));

export const math_RedeemIn = (reserveRatio: Decimal, supply: Decimal, balance: Decimal, amount: Decimal) =>
  balance.mul(ONE.sub(ONE.sub(amount.div(supply)).pow(MAX_WEIGHT.div(reserveRatio))));

export const math_RedeemOut = (reserveRatio: Decimal, supply: Decimal, balance: Decimal, amount: Decimal) =>
  supply.mul(ONE.sub(amount.div(balance)).pow(reserveRatio.div(MAX_WEIGHT)).sub(ONE).mul(-1));

describe('Swap Issuer', function () {
  //Account Address
  let accounts: Wallets;

  // let issueToken: MockERC20ManagedSupply;
  // let reserveToken: MockToken;
  let issuer: MockSwapIssuer;

  beforeEach('deploy tokens', async () => {
    accounts = await wallets();

    ({ issuer } = await setupEnviroment_MockSwapIssuer(
      accounts.czDeployer,
      [accounts.trader1],
      '0.1',
      WEI_VALUE,
      '160000',
      '0.05'
    ));
  });

  describe('Swaps', function () {
    describe('Math Checks', function () {
      const testSwapMath = (method: (...args: [...Decimal[]]) => Decimal, maxError: string, ...args: string[]) =>
        async function () {
          // eslint-disable-next-line prefer-spread
          const expected = method.apply(
            null,
            args.map((x) => new Decimal(x))
          );

          const actual = new Decimal(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (await (<any>issuer.connect(accounts.czDeployer))[method.name].apply(null, args)).toString()
          );

          console.log(expected);
          console.log(actual);

          if (!actual.eq(expected)) {
            const error = actual.div(expected).sub(1).abs();
            assert(error.lte(maxError), `error = ${error.toFixed()}`);
          }
        };

      // const args = [
      //   '100000',
      //   ether('9654682.13847').toString(),
      //   ether('1').toString(),
      //   ether('9610866.79145').toString(),
      // ];
      // const args = ['100000', ether('1000000').toString(), ether('5000').toString(), ether('5000000').toString()];

      // it(`IssueIn ${args.join(', ')}`, testSwapMath(math_IssueIn, '0.0000000000001', ...args));
      // it(`IssueOut ${args.join(', ')}`, testSwapMath(math_IssueOut, '0.0001', ...args));
      // it(`RedeemIn ${args.join(', ')}`, testSwapMath(math_RedeemIn, '0.0000000000001', ...args));
      // it(`RedeemOut ${args.join(', ')}`, testSwapMath(math_RedeemOut, '0.0000000000001', ...args));

      for (const supply of [1, 2, 3, 4].map((n) => `${n}`.repeat(21 + n)))
        for (const balance of [1, 2, 3, 4].map((n) => `${n}`.repeat(21 + n)))
          for (const ratio of [10, 20, 90, 100].map((p) => `${p * 10000}`))
            for (const amount of [1, 2, 3, 4].map((n) => `${n}`.repeat(18 + n))) {
              const args = [ratio, supply, balance, amount];
              it(`IssueIn ${args.join(', ')}`, testSwapMath(math_IssueIn, '0.0000000000001', ...args));
              it(`IssueOut ${args.join(', ')}`, testSwapMath(math_IssueOut, '0.0001', ...args));
              if (new Decimal(amount).lte(supply)) {
                it(`RedeemIn ${args.join(', ')}`, testSwapMath(math_RedeemIn, '0.0000000000001', ...args));
              }
              if (new Decimal(amount).lte(balance)) {
                it(`RedeemOut ${args.join(', ')}`, testSwapMath(math_RedeemOut, '0.0000000000001', ...args));
              }
            }
    });
  });
});
