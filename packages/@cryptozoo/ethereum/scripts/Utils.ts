import { ethers } from 'hardhat';
import { ContractReceipt, ContractTransaction } from '@ethersproject/contracts';
import { BigNumber } from '@ethersproject/bignumber';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';

export enum WalletList {
  wethDeployer,
  czDeployer,
  czAdmin,
  balDeployer,
  balAdmin,
  trader1,
  trader2,
}

export interface Wallets {
  [key: string]: SignerWithAddress;
}

export const WEI_VALUE = ethers.utils.formatEther('1');

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export function ether(value: string): BigNumber {
  return ethers.utils.parseEther(value);
}

export async function getSigner(wallet: WalletList): Promise<SignerWithAddress> {
  return (await ethers.getSigners())[wallet];
}

export async function wallets(): Promise<Wallets> {
  const ethersSigners = await ethers.getSigners();

  const wallets = Object.keys(WalletList).reduce((wallets, value) => {
    const walletPosition = Number(value);
    if (!isNaN(walletPosition)) wallets[WalletList[walletPosition]] = ethersSigners[walletPosition];
    return wallets;
  }, {} as Wallets);

  return wallets;
}

export async function txConfirmation(tx: ContractTransaction | Promise<ContractTransaction>): Promise<ContractReceipt> {
  return (await tx).wait();
}
