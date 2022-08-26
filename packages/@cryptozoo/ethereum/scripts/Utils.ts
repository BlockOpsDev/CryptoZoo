import { ethers } from 'hardhat';
import { ContractReceipt, ContractTransaction } from '@ethersproject/contracts';
import { BigNumber } from '@ethersproject/bignumber';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';

export enum wallets {
  wethDeployer,
  czDeployer,
  czAdmin,
  balDeployer,
  balAdmin,
  trader,
}

export const WEI_VALUE = ethers.utils.formatEther('1');

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export function ether(value: string): BigNumber {
  return ethers.utils.parseEther(value);
}

export async function getSigner(wallet: wallets): Promise<SignerWithAddress> {
  return (await ethers.getSigners())[wallet];
}

export async function txConfirmation(tx: ContractTransaction | Promise<ContractTransaction>): Promise<ContractReceipt> {
  return (await tx).wait();
}
