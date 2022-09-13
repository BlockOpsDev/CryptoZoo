import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { BigNumber } from '@ethersproject/bignumber';
import { approveSpenders, deploy_MockToken } from '../Utils';

import { MockSwapIssuer, MockERC20Issuable, MockToken } from '../../typechain-types';
import { deploy_MockERC20Issuable } from './ERC20Issuable';

import { Decimal } from 'decimal.js';
import { SwapIssuer } from '../../typechain-types/contracts/ContinuousTokenOfferingPool/SwapIssuer/test/MockSwapIssuer';

export interface TokenInitialVals {
  reserveRatio: BigNumber;
  minReserve: BigNumber;
  supply: BigNumber;
}

export async function calcInitialValues_SwapIssuer(
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

export async function setupEnviroment_MockSwapIssuer(
  deployer: SignerWithAddress,
  users: SignerWithAddress[],
  reserveRatio_: string,
  minReserve_: string,
  reservePoint_: string,
  pricePoint_: string
): Promise<{ reserveToken: MockToken; issueToken: MockERC20Issuable; issuer: MockSwapIssuer }> {
  const reserveToken = await deploy_MockToken('1000', users);
  const issueToken = await deploy_MockERC20Issuable(deployer, 'Issue', 'I');

  const { reserveRatio, minReserve, supply } = await calcInitialValues_SwapIssuer(
    reserveRatio_,
    minReserve_,
    reservePoint_,
    pricePoint_
  );

  const issuer = await deploy_MockSwapIssuer(
    deployer,
    {
      reserveRatio,
      minReserve,
      reserveToken: reserveToken.address,
      issueToken: issueToken.address,
    },
    supply
  );

  await issueToken.updateIssuer(issuer.address);

  await approveSpenders(reserveToken, users, [issuer.address]);

  return { reserveToken, issueToken, issuer };
}

export async function deploy_MockSwapIssuer(
  deployer: SignerWithAddress,
  swapIssuerParams: SwapIssuer.SwapIssuerParamsStruct,
  supply: BigNumber
): Promise<MockSwapIssuer> {
  const SwapIssuerFactory = await ethers.getContractFactory('MockSwapIssuer');
  const swapIssuer = await SwapIssuerFactory.connect(deployer).deploy(swapIssuerParams, supply);

  return swapIssuer;
}
