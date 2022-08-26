import { assert, expect } from 'chai';
import { ethers } from 'hardhat';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { init_ContinuousToken } from '../../scripts/mock_deploy/ContinuousToken';
import { getSigner, wallets, WEI_VALUE } from '../../scripts/Utils';
import { MockContinuousToken } from '../../typechain-types';
import { MockToken } from '@balancer-labs/ethereum/typechain-types';

import { Decimal } from 'decimal.js';

const ONE = new Decimal(1);
const MAX_WEIGHT = new Decimal(1000000);

const math_continuousMintIn = (reserveRatio: Decimal, supply: Decimal, balance: Decimal, amount: Decimal) =>
  supply.mul(ONE.add(amount.div(balance)).pow(reserveRatio.div(MAX_WEIGHT)).sub(ONE));

const math_continuousBurnIn = (reserveRatio: Decimal, supply: Decimal, balance: Decimal, amount: Decimal) =>
  balance.mul(ONE.sub(ONE.sub(amount.div(supply)).pow(MAX_WEIGHT.div(reserveRatio))));

describe('Continuous Token', function () {
  //Account Address
  let deployer: SignerWithAddress;

  let continuousToken: MockContinuousToken;
  let reserveToken: MockToken;

  beforeEach('deploy tokens', async () => {
    deployer = await getSigner(wallets.czDeployer);
    ({ continuousToken, reserveToken } = await init_ContinuousToken(deployer, '0.1', WEI_VALUE, '160000', '0.05'));
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
            (await (<any>continuousToken.connect(deployer))[method.name].apply(null, args)).toString()
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
              it(`MintIn ${args.join(', ')}`, testSwapMath(math_continuousMintIn, '0.0000000000001', ...args));
              if (new Decimal(amount).lte(supply)) {
                it(`BurnIn ${args.join(', ')}`, testSwapMath(math_continuousBurnIn, '0.0000000000001', ...args));
              }
            }
    });
    // console.log(await reserveToken.balanceOf(deployer.address));
    // await continuousToken.connect(deployer).continuousMintIn(ethers.utils.parseUnits('160000', 18).sub(1));
    // console.log(await continuousToken.balanceOf(deployer.address));
    // continuousToken.continuousMintIn(ethers.utils.parseUnits('160000', 18).sub(1));
    // console.log(continuousToken.balanceOf(continuousToken.address));
    // console.log(await continuousToken.totalSupply());
    // expect(1).to.equal(1);
    // console.log(await continuousToken.totalSupply());
    // expect(1).to.equal(1);
  });
});
