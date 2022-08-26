import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { Decimal } from 'decimal.js';
import { MaxUint256 } from '@ethersproject/constants';

import { getSigner, wallets } from '../Utils';
import { MockContinuousToken } from '../../typechain-types';
import { IContinuousToken } from '../../typechain-types/contracts/token-continuous/test/MockContinuousToken';
import { MockToken } from '@balancer-labs/ethereum/typechain-types';
import { deployToken } from '@balancer-labs/ethereum';

export interface TokenVars {
  name: string;
  symbol: string;
  reserveRatio: string;
  minReserve: string;
  reserve: string;
  price: string;
}

export async function params_ContinuousToken(tokenVars: TokenVars): Promise<IContinuousToken.TokenParamsStruct> {
  //Convert to Decimal.js
  const ReserveRatio = new Decimal(tokenVars.reserveRatio);
  const Reserve = new Decimal(tokenVars.reserve);
  const Price = new Decimal(tokenVars.price);
  const Supply = Reserve.div(Price.mul(ReserveRatio)).mul(Reserve.div(tokenVars.minReserve).pow(ReserveRatio.mul(-1)));

  const params: IContinuousToken.TokenParamsStruct = {
    name: tokenVars.name,
    symbol: tokenVars.symbol,
    minReserve: ethers.utils.parseUnits(tokenVars.minReserve, 18),
    supply: ethers.utils.parseUnits(Supply.toString(), 18),
    reserveRatio: ethers.utils.parseUnits(tokenVars.reserveRatio, 6),
  };

  return params;
}

export async function init_ContinuousToken(
  deployer: SignerWithAddress,
  reserveRatio: string,
  minReserve: string,
  reserve: string,
  price: string
): Promise<{ continuousToken: MockContinuousToken; reserveToken: MockToken }> {
  const tokenParams = await params_ContinuousToken(<TokenVars>{
    name: 'Test',
    symbol: 'T1',
    reserveRatio,
    minReserve,
    reserve,
    price,
  });

  const reserveToken = await deploy_ReserveToken(deployer.address);
  const continuousToken = await deploy_ContinuousToken(deployer, reserveToken.address, tokenParams);

  await reserveToken.connect(deployer).approve(continuousToken.address, MaxUint256);

  return { continuousToken, reserveToken };
}

export async function deploy_ReserveToken(recipientAddress: string): Promise<MockToken> {
  const reserveTokenDeployer = await getSigner(wallets.wethDeployer);
  const reserveToken = (await deployToken('WETH', reserveTokenDeployer)) as MockToken;
  await reserveToken.connect(reserveTokenDeployer).mint(recipientAddress, MaxUint256);
  return reserveToken;
}

export async function deploy_ContinuousToken(
  deployer: SignerWithAddress,
  reserveAddress: string,
  tokenParams: IContinuousToken.TokenParamsStruct
): Promise<MockContinuousToken> {
  const ContinuousTokenFactory = await ethers.getContractFactory('MockContinuousToken');
  const continuousToken = await ContinuousTokenFactory.connect(deployer).deploy(reserveAddress, tokenParams);

  return continuousToken;
}
