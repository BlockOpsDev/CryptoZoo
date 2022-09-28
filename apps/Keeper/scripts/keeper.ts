import { ethers } from 'hardhat';
import { BigNumber, BigNumberish } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { approveSpenders, getSigner, WalletList, WEI_VALUE, ZERO_ADDRESS } from '@cryptozoo/ethereum/scripts/Utils';

import { PromiseOrValue } from '../typechain-types/common';
import { MockToken } from '@balancer-labs/ethereum/typechain-types';
import { Keeper, KeeperOffering } from '../typechain-types';
import { ContinuousTokenOfferingPool, SwapIssuer } from '../typechain-types/contracts/KeeperOffering';

import { calcInitialValues_SwapIssuer } from '@cryptozoo/ethereum/scripts/contract-utils/SwapIssuer';
import { pickTokens, setupEnvironment } from '@balancer-labs/ethereum';

export interface KeeperEnviroment {
  keeper: Keeper;
  keeperOffering: KeeperOffering;
  reserveToken: MockToken;
  initSupply: BigNumber;
}

export async function deploy_Keeper(deployer: SignerWithAddress): Promise<Keeper> {
  const Keeper = await ethers.getContractFactory('Keeper', deployer);
  const keeper = await Keeper.deploy('Keeper', 'KPR');

  return keeper;
}

export async function deploy_KeeperOffering(
  deployer: SignerWithAddress,
  poolParams: ContinuousTokenOfferingPool.PoolParamsStruct,
  swapIssuerParams: SwapIssuer.SwapIssuerParamsStruct
): Promise<KeeperOffering> {
  const KeeperOffering = await ethers.getContractFactory('KeeperOffering', deployer);
  const keeperOffering = await KeeperOffering.deploy(poolParams, swapIssuerParams);

  return keeperOffering;
}

export async function deploy_keeperTestEnviroment(
  params: {
    swapFeePercentage: PromiseOrValue<BigNumberish>;
    reserveRatio: string;
    reservePoint: string;
    pricePoint: string;
  },
  traders: SignerWithAddress[]
): Promise<KeeperEnviroment> {
  const deployer = await getSigner(WalletList.czDeployer);

  const { vault, tokens } = await setupEnvironment(
    await getSigner(WalletList.balDeployer),
    await getSigner(WalletList.balAdmin),
    traders
  );

  const reserveToken = pickTokens(tokens, 1)[0];

  const keeper = await deploy_Keeper(deployer);

  const poolParams = <ContinuousTokenOfferingPool.PoolParamsStruct>{
    vault: vault.address,
    assetManagers: [ZERO_ADDRESS, ZERO_ADDRESS],
    swapFeePercentage: params.swapFeePercentage,
    pauseWindowDuration: '0',
    bufferPeriodDuration: '0',
    owner: (await getSigner(WalletList.czAdmin)).address,
  };

  const { reserveRatio, minReserve, supply } = await calcInitialValues_SwapIssuer(
    params.reserveRatio,
    WEI_VALUE,
    params.reservePoint,
    params.pricePoint
  );

  const swapIssuerParams = <SwapIssuer.SwapIssuerParamsStruct>{
    reserveRatio,
    minReserve,
    reserveToken: reserveToken.address,
    issueToken: keeper.address,
  };

  const keeperOffering = await deploy_KeeperOffering(deployer, poolParams, swapIssuerParams);

  await keeper.updateIssuer(keeperOffering.address);
  await keeperOffering.initialize(supply);

  await approveSpenders(keeper, traders, [vault.address]);
  await approveSpenders(reserveToken, traders, [vault.address]);

  return { keeper, keeperOffering, reserveToken, initSupply: supply };
}
