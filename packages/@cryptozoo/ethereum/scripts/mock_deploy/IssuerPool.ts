import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { BigNumber } from '@ethersproject/bignumber';
import { approveSpenders, WEI_VALUE } from '../Utils';

import { ERC20ManagedSupply, MockIssuerPool } from '../../typechain-types';
import { IssuerPool } from '../../typechain-types/contracts/pool-continuous/test/MockIssuerPool';
import { MockToken } from '@balancer-labs/ethereum/typechain-types';

import { calcInitialValues_ConstantReserveRatioIssuer, TokenInitialVals } from './ConstantReserveRatioIssuer';
import { deploy_MockERC20ManagedSupply } from './ERC20ManagedSupply';

export interface PoolVars {
  assetManagers: string[];
  swapFeePercentage: string;
  pauseWindowDuration: string;
  bufferPeriodDuration: string;
  owner: string;
}

export async function setupEnviroment_MockIssuerPool(
  deployer: SignerWithAddress,
  users: SignerWithAddress[],
  vaultAddress: string,
  poolVars: PoolVars,
  reserveRatio_: string,
  reservePoint_: string,
  pricePoint_: string,
  reserveToken: MockToken
): Promise<{
  issueToken: ERC20ManagedSupply;
  issuerPool: MockIssuerPool;
  poolParams: IssuerPool.PoolParamsStruct;
  tokenInitialVals: TokenInitialVals;
  // tokenParams: IContinuousToken.TokenParamsStruct;
}> {
  const issueToken = await deploy_MockERC20ManagedSupply(deployer, 'Issue', 'I');

  const tokenInitialVals = await calcInitialValues_ConstantReserveRatioIssuer(
    reserveRatio_,
    WEI_VALUE,
    reservePoint_,
    pricePoint_
  );

  const poolParams: IssuerPool.PoolParamsStruct = { vault: vaultAddress, ...poolVars };
  const issuerPool = await deploy_MockIssuerPool(
    deployer,
    poolParams,
    tokenInitialVals.reserveRatio,
    reserveToken.address,
    issueToken.address
  );

  await issueToken.updateSupplyManager(issuerPool.address);

  await issuerPool.initialize(tokenInitialVals.supply);

  await approveSpenders(issueToken, users, [vaultAddress]);
  await approveSpenders(reserveToken, users, [vaultAddress]);

  return { issueToken, issuerPool, poolParams, tokenInitialVals };
}

export async function deploy_MockIssuerPool(
  deployer: SignerWithAddress,
  poolParams: IssuerPool.PoolParamsStruct,
  reserveRatio: BigNumber,
  reserveTokenAddress: string,
  issueTokenAddress: string
): Promise<MockIssuerPool> {
  const IssuerPoolFactory = await ethers.getContractFactory('MockIssuerPool', deployer);
  const issuerPool = await IssuerPoolFactory.deploy(poolParams, reserveRatio, reserveTokenAddress, issueTokenAddress);

  return issuerPool;
}
