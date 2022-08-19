import { ContinuousToken } from '../typechain-types';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';

export async function init_ContinuousToken(deployer: SignerWithAddress): Promise<ContinuousToken> {
  const continousToken = await deploy_ContinuousToken(deployer);
  await continousToken.init();

  return continousToken;
}

export async function deploy_ContinuousToken(deployer: SignerWithAddress): Promise<ContinuousToken> {
  // const [deployer] = await ethers.getSigners();

  const ContinuousTokenFactory = await ethers.getContractFactory('ContinuousToken');
  const continousToken = await ContinuousTokenFactory.connect(deployer).deploy(
    'Keeper',
    'KPR',
    ethers.utils.parseUnits('1000000', 18),
    100000
  );

  return continousToken;
}
