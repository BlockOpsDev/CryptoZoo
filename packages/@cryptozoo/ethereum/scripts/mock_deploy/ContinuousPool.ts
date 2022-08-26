import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';

import { MockContinuousPool } from '../../typechain-types';
import { IContinuousToken } from '../../typechain-types/contracts/token-continuous/test/MockContinuousToken';
import { IContinuousPool } from '../../typechain-types/contracts/pool-continuous/test/MockContinuousPool';

import { Vault } from '@balancer-labs/typechain';
import { MockToken } from '@balancer-labs/ethereum/typechain-types';
import { deployVault } from '@balancer-labs/ethereum';

import { getSigner, wallets } from '../Utils';
import { deploy_ReserveToken, params_ContinuousToken, TokenVars } from './ContinuousToken';

export interface PoolVars {
  assetManagers: string[];
  swapFeePercentage: string;
  pauseWindowDuration: string;
  bufferPeriodDuration: string;
  owner: string;
}

export async function init_ContinuousPool(
  deployer: SignerWithAddress,
  tokenVars: TokenVars,
  poolVars: PoolVars
): Promise<{ vault: Vault; continuousPool: MockContinuousPool; reserveToken: MockToken }> {
  const vault = await deployVault((await getSigner(wallets.balAdmin)).address, await getSigner(wallets.balDeployer));

  const reserveToken = await deploy_ReserveToken(deployer.address);

  const tokenParams = await params_ContinuousToken(tokenVars);
  const poolParams = { reserveToken: reserveToken.address, vault: vault.address, ...poolVars };
  const continuousPool = await deploy_ContinuousPool(deployer, tokenParams, poolParams);

  //Approve Vault to spend Reserve

  return { vault, continuousPool, reserveToken };
}

export async function deploy_ContinuousPool(
  deployer: SignerWithAddress,
  tokenParams: IContinuousToken.TokenParamsStruct,
  poolParams: IContinuousPool.PoolParamsStruct
): Promise<MockContinuousPool> {
  const ContinuousPoolFactory = await ethers.getContractFactory('MockContinuousPool');
  const continuousPool = await ContinuousPoolFactory.connect(deployer).deploy(tokenParams, poolParams);

  return continuousPool;
}
