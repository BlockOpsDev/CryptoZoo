import { ethers } from 'hardhat';
import { Contract, ContractReceipt, ContractTransaction } from '@ethersproject/contracts';
import { MaxUint256 } from '@ethersproject/constants';
import { BigNumber } from '@ethersproject/bignumber';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { MockToken } from '../typechain-types';

export enum WalletList {
  defaultDeployer,
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

export async function deploy_MockToken(
  amount: string,
  users: SignerWithAddress[],
  deployer?: SignerWithAddress
): Promise<MockToken> {
  const TokenFactory = await ethers.getContractFactory('MockToken');
  const token = await TokenFactory.connect(deployer || (await getSigner(WalletList.defaultDeployer))).deploy(
    'Mock',
    'M'
  );

  for (const user of users) {
    await token.mint(user.address, ether(amount));
  }

  return token;
}

export async function approveSpenders(token: Contract, users: SignerWithAddress[], spenders: string[]) {
  for (const user of users) {
    for (const spender of spenders) {
      await token.connect(user).approve(spender, MaxUint256);
    }
  }
}
