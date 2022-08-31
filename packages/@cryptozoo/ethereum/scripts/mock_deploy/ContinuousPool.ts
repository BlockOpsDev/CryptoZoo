import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { MaxUint256 } from '@ethersproject/constants';

import { MockContinuousPool } from '../../typechain-types';
import { IContinuousToken } from '../../typechain-types/contracts/token-continuous/test/MockContinuousToken';
import { IContinuousPool } from '../../typechain-types/contracts/pool-continuous/test/MockContinuousPool';

import { Vault } from '@balancer-labs/typechain';
import { params_ContinuousToken, TokenVars } from './ContinuousToken';

export interface PoolVars {
  assetManagers: string[];
  swapFeePercentage: string;
  pauseWindowDuration: string;
  bufferPeriodDuration: string;
  owner: string;
}

export async function init_ContinuousPool(
  deployer: SignerWithAddress,
  vault: Vault,
  tokenVars: TokenVars,
  poolVars: PoolVars
): Promise<{
  continuousPool: MockContinuousPool;
  poolParams: IContinuousPool.PoolParamsStruct;
  tokenParams: IContinuousToken.TokenParamsStruct;
}> {
  const tokenParams = await params_ContinuousToken(tokenVars);
  const poolParams = { vault: vault.address, ...poolVars };
  const continuousPool = await deploy_ContinuousPool(deployer, tokenParams, poolParams);

  await continuousPool.initialize();
  await tokenVars.reserveToken.connect(deployer).approve(vault.address, MaxUint256);

  return { continuousPool, poolParams, tokenParams };
}

export async function deploy_ContinuousPool(
  deployer: SignerWithAddress,
  tokenParams: IContinuousToken.TokenParamsStruct,
  poolParams: IContinuousPool.PoolParamsStruct
): Promise<MockContinuousPool> {
  const ContinuousPoolFactory = await ethers.getContractFactory('MockContinuousPool', deployer);
  const continuousPool = await ContinuousPoolFactory.deploy(tokenParams, poolParams);

  return continuousPool;
}
