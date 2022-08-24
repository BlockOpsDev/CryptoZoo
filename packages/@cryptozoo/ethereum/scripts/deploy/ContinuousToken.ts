import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { Decimal } from 'decimal.js';
import { MaxUint256 } from '@ethersproject/constants';

import { getSigner, wallets } from '../Utils';
import { MockContinuousToken } from '../../typechain-types';
import { MockToken } from '@balancer-labs/ethereum/typechain-types';
import { deployToken } from '@balancer-labs/ethereum';

export async function init_ContinuousToken(
  deployer: SignerWithAddress,
  reserveRatio: string,
  minReserve: string,
  reserve: string,
  price: string
): Promise<{ continuousToken: MockContinuousToken; reserveToken: MockToken }> {
  const reserveTokenDeployer = await getSigner(wallets.wethDeployer);
  const reserveToken = (await deployToken('WETH', reserveTokenDeployer)) as MockToken;
  await reserveToken.connect(reserveTokenDeployer).mint(deployer.address, MaxUint256);

  //Convert to Decimal.js
  const ReserveRatio = new Decimal(reserveRatio);
  const Reserve = new Decimal(reserve);
  const Price = new Decimal(price);
  const Supply = Reserve.div(Price.mul(ReserveRatio)).mul(Reserve.div(minReserve).pow(ReserveRatio.mul(-1)));

  const continuousToken = await deploy_ContinuousToken(
    deployer,
    reserveRatio,
    minReserve,
    Supply.toString(),
    reserveToken.address
  );

  await reserveToken.connect(deployer).approve(continuousToken.address, MaxUint256);

  return { continuousToken, reserveToken };
}

export async function deploy_ContinuousToken(
  deployer: SignerWithAddress,
  reserveRatio: string,
  minReserve: string,
  initialSupply: string,
  reserveAddress: string
): Promise<MockContinuousToken> {
  const ContinuousTokenFactory = await ethers.getContractFactory('MockContinuousToken');
  const continuousToken = await ContinuousTokenFactory.connect(deployer).deploy(
    reserveAddress,
    'Test',
    'T1',
    ethers.utils.parseUnits(minReserve, 18),
    ethers.utils.parseUnits(initialSupply, 18),
    ethers.utils.parseUnits(reserveRatio, 6)
  );

  return continuousToken;
}
