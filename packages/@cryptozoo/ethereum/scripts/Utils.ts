import { ethers } from 'hardhat';
import { ContractReceipt, ContractTransaction } from '@ethersproject/contracts';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';

export enum wallets {
  czDeployer,
  czAdmin,
  trader,
}

export async function getSigner(wallet: wallets): Promise<SignerWithAddress> {
  return (await ethers.getSigners())[wallet];
}

export async function txConfirmation(tx: ContractTransaction | Promise<ContractTransaction>): Promise<ContractReceipt> {
  return (await tx).wait();
}
