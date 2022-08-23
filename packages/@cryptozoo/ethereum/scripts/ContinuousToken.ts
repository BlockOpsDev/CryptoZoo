import { ContinuousToken } from '../typechain-types';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { Decimal } from 'decimal.js';
import { MaxUint256 } from '@ethersproject/constants';

import { getSigner, wallets } from './Utils';

import { MockToken } from '@balancer-labs/ethereum/typechain-types';
import { deployToken } from '@balancer-labs/ethereum';

export async function init_ContinuousToken(
  deployer: SignerWithAddress,
  reserveRatio: number,
  initialReserve: string,
  initialSupply: string
): Promise<{ continuousToken: ContinuousToken; reserveToken: MockToken }> {
  const reserveTokenDeployer = await getSigner(wallets.wethDeployer);
  const reserveToken = (await deployToken('WETH', reserveTokenDeployer)) as MockToken;
  await reserveToken.connect(reserveTokenDeployer).mint(deployer.address, ethers.utils.parseUnits('10000000', 18));

  //Convert to Decimal.js
  const initialReserveN = new Decimal(initialReserve);
  const initialSupplyN = new Decimal(initialSupply);

  const initSuppply = initialSupplyN.mul(initialReserveN.div('1e-18').pow(-reserveRatio)).toString();

  const continuousToken = await deploy_ContinuousToken(deployer, reserveRatio, initSuppply, reserveToken.address);

  await reserveToken.connect(deployer).approve(continuousToken.address, MaxUint256);

  await continuousToken.connect(deployer).initialize(ethers.utils.parseUnits(initialReserve, 18));

  return { continuousToken, reserveToken };
}

export async function deploy_ContinuousToken(
  deployer: SignerWithAddress,
  reserveRatio: number,
  initialSupply: string,
  reserveAddress: string
): Promise<ContinuousToken> {
  const ContinuousTokenFactory = await ethers.getContractFactory('ContinuousToken');
  const continuousToken = await ContinuousTokenFactory.connect(deployer).deploy(
    'Keeper',
    'KPR',
    ethers.utils.parseUnits(initialSupply, 18),
    1000000 * reserveRatio,
    reserveAddress
  );

  return continuousToken;
}
