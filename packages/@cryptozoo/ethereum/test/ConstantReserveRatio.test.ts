import { assert } from 'chai';
import { Decimal } from 'decimal.js';
import { Wallets, wallets, WEI_VALUE } from '../scripts/Utils';

import { MockConstantReserveRatioIssuer } from '../typechain-types';
import { setupEnviroment_MockConstantReserveRatioIssuer } from '../scripts/mock_deploy/ConstantReserveRatioIssuer';

const ONE = new Decimal(1);
const MAX_WEIGHT = new Decimal(1000000);

export const math_IssueIn = (reserveRatio: Decimal, supply: Decimal, balance: Decimal, amount: Decimal) =>
  supply.mul(ONE.add(amount.div(balance)).pow(reserveRatio.div(MAX_WEIGHT)).sub(ONE));

export const math_RedeemIn = (reserveRatio: Decimal, supply: Decimal, balance: Decimal, amount: Decimal) =>
  balance.mul(ONE.sub(ONE.sub(amount.div(supply)).pow(MAX_WEIGHT.div(reserveRatio))));

describe('Constant Reserve Ratio Issuer', function () {
  //Account Address
  let accounts: Wallets;

  // let issueToken: MockERC20ManagedSupply;
  // let reserveToken: MockToken;
  let issuer: MockConstantReserveRatioIssuer;

  beforeEach('deploy tokens', async () => {
    accounts = await wallets();

    ({ issuer } = await setupEnviroment_MockConstantReserveRatioIssuer(
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

          if (!actual.eq(expected)) {
            const error = actual.div(expected).sub(1).abs();
            assert(error.lte(maxError), `error = ${error.toFixed()}`);
          }
        };

      for (const supply of [1, 2, 3, 4].map((n) => `${n}`.repeat(21 + n)))
        for (const balance of [1, 2, 3, 4].map((n) => `${n}`.repeat(21 + n)))
          for (const ratio of [10, 20, 90, 100].map((p) => `${p * 10000}`))
            for (const amount of [1, 2, 3, 4].map((n) => `${n}`.repeat(18 + n))) {
              const args = [ratio, supply, balance, amount];
              it(`MintIn ${args.join(', ')}`, testSwapMath(math_IssueIn, '0.0000000000001', ...args));
              if (new Decimal(amount).lte(supply)) {
                it(`BurnIn ${args.join(', ')}`, testSwapMath(math_RedeemIn, '0.0000000000001', ...args));
              }
            }
    });
  });
});
