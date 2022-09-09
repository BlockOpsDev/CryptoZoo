import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { BigNumber } from '@ethersproject/bignumber';
import { approveSpenders, deploy_MockToken } from '../Utils';

import { MockConstantReserveRatioIssuer, MockERC20ManagedSupply, MockToken } from '../../typechain-types';
import { deploy_MockERC20ManagedSupply } from './ERC20ManagedSupply';

import { Decimal } from 'decimal.js';

export interface TokenInitialVals {
  reserveRatio: BigNumber;
  minReserve: BigNumber;
  supply: BigNumber;
}

export async function calcInitialValues_ConstantReserveRatioIssuer(
  reserveRatio: string,
  minReserve: string,
  reserve: string,
  price: string
): Promise<TokenInitialVals> {
  //Convert to Decimal.js
  const ReserveRatio = new Decimal(reserveRatio);
  const Reserve = new Decimal(reserve);
  const Price = new Decimal(price);
  const Supply = Reserve.div(Price.mul(ReserveRatio)).mul(Reserve.div(minReserve).pow(ReserveRatio.mul(-1)));

  return {
    reserveRatio: ethers.utils.parseUnits(reserveRatio, 6),
    minReserve: ethers.utils.parseUnits(minReserve, 18),
    supply: ethers.utils.parseUnits(Supply.toString(), 18),
  };
}

export async function setupEnviroment_MockConstantReserveRatioIssuer(
  deployer: SignerWithAddress,
  users: SignerWithAddress[],
  reserveRatio_: string,
  minReserve_: string,
  reservePoint_: string,
  pricePoint_: string
): Promise<{ reserveToken: MockToken; issueToken: MockERC20ManagedSupply; issuer: MockConstantReserveRatioIssuer }> {
  const reserveToken = await deploy_MockToken('1000', users);
  const issueToken = await deploy_MockERC20ManagedSupply(deployer, 'Issue', 'I');

  const { reserveRatio, minReserve, supply } = await calcInitialValues_ConstantReserveRatioIssuer(
    reserveRatio_,
    minReserve_,
    reservePoint_,
    pricePoint_
  );

  const issuer = await deploy_MockConstantReserveRatioIssuer(
    deployer,
    reserveToken.address,
    issueToken.address,
    reserveRatio,
    minReserve,
    supply
  );

  await issueToken.updateSupplyManager(issuer.address);

  await approveSpenders(reserveToken, users, [issuer.address]);

  return { reserveToken, issueToken, issuer };
}

export async function deploy_MockConstantReserveRatioIssuer(
  deployer: SignerWithAddress,
  reserveTokenAddress: string,
  issueTokenAddress: string,
  reserveRatio: BigNumber,
  minReserve: BigNumber,
  supply: BigNumber
): Promise<MockConstantReserveRatioIssuer> {
  const ConstantReserveRatioIssuerFactory = await ethers.getContractFactory('MockConstantReserveRatioIssuer');
  const constantReserveRatioIssuer = await ConstantReserveRatioIssuerFactory.connect(deployer).deploy(
    reserveRatio,
    minReserve,
    supply,
    reserveTokenAddress,
    issueTokenAddress
  );

  return constantReserveRatioIssuer;
}
