import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { BigNumberish, BigNumber } from '@ethersproject/bignumber';
import { approveSpenders, ether } from '../Utils';
import { Decimal } from 'decimal.js';

import { PromiseOrValue } from '@balancer-labs/ethereum/typechain-types/common';
import { SwapIssuer } from '../../typechain-types/contracts/ContinuousTokenOfferingPool/SwapIssuer/test/MockSwapIssuer';
import { ContinuousTokenOfferingPool } from '../../typechain-types/contracts/ContinuousTokenOfferingPool/test/MockContinuousTokenOfferingPool';
import { ERC20Issuable, MockContinuousTokenOfferingPool } from '../../typechain-types';
import { MockToken } from '@balancer-labs/ethereum/typechain-types';

import { calcInitialValues_SwapIssuer, TokenInitialVals } from './SwapIssuer';
import { deploy_MockERC20Issuable } from './ERC20Issuable';

export enum SwapKind {
  GIVEN_IN,
  GIVEN_OUT,
}

//Testing Helper Functions
export const addFee = (swapAmount: BigNumber | Decimal, swapFeePercentage: PromiseOrValue<BigNumberish>): string => {
  return swapAmount
    .mul(ether('1').toString())
    .sub('1')
    .div(ether('1').sub(swapFeePercentage.toString()).toString())
    .add('1')
    .toString();
};

export const subtractFee = (
  swapAmount: BigNumber | Decimal,
  swapFeePercentage: PromiseOrValue<BigNumberish>
): string => {
  return swapAmount
    .sub(swapAmount.mul(swapFeePercentage.toString()).sub(1).div(ether('1').toString()).add(1).toString())
    .toString();
};

export interface PoolVars {
  assetManagers: string[];
  swapFeePercentage: string;
  pauseWindowDuration: string;
  bufferPeriodDuration: string;
  owner: string;
}

export async function setupEnviroment_MockContinuousTokenOfferingPool(
  deployer: SignerWithAddress,
  users: SignerWithAddress[],
  vaultAddress: string,
  poolVars: PoolVars,
  reserveRatio_: string,

  reservePoint_: string,
  pricePoint_: string,
  minReserve_: string,

  reserveToken: MockToken
): Promise<{
  issueToken: ERC20Issuable;
  CTOPool: MockContinuousTokenOfferingPool;
  poolParams: ContinuousTokenOfferingPool.PoolParamsStruct;
  tokenInitialVals: TokenInitialVals;
  // tokenParams: IContinuousToken.TokenParamsStruct;
}> {
  const issueToken = await deploy_MockERC20Issuable(deployer, 'Issue', 'I');

  const tokenInitialVals = await calcInitialValues_SwapIssuer(reserveRatio_, minReserve_, reservePoint_, pricePoint_);

  const poolParams: ContinuousTokenOfferingPool.PoolParamsStruct = { vault: vaultAddress, ...poolVars };

  const CTOPool = await deploy_MockContinuousTokenOfferingPool(deployer, poolParams, {
    reserveRatio: tokenInitialVals.reserveRatio,
    minReserve: tokenInitialVals.minReserve,
    reserveToken: reserveToken.address,
    issueToken: issueToken.address,
  });

  await issueToken.updateIssuer(CTOPool.address);

  await CTOPool.initialize(tokenInitialVals.supply);

  await approveSpenders(issueToken, users, [vaultAddress]);
  await approveSpenders(reserveToken, users, [vaultAddress]);

  return { issueToken, CTOPool, poolParams, tokenInitialVals };
}

export async function deploy_MockContinuousTokenOfferingPool(
  deployer: SignerWithAddress,
  poolParams: ContinuousTokenOfferingPool.PoolParamsStruct,
  swapIssuerParams: SwapIssuer.SwapIssuerParamsStruct
): Promise<MockContinuousTokenOfferingPool> {
  const ContinuousTokenOfferingPoolFactory = await ethers.getContractFactory(
    'MockContinuousTokenOfferingPool',
    deployer
  );
  const CTOPool = await ContinuousTokenOfferingPoolFactory.deploy(poolParams, swapIssuerParams);

  return <MockContinuousTokenOfferingPool>CTOPool;
}
