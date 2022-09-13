import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';

import { MockERC20Issuable } from '../../typechain-types';

export async function deploy_MockERC20Issuable(
  deployer: SignerWithAddress,
  name: string,
  symbol: string
): Promise<MockERC20Issuable> {
  const ERC20IssuableFactory = await ethers.getContractFactory('MockERC20Issuable');
  const ERC20Issuable = await ERC20IssuableFactory.connect(deployer).deploy(name, symbol);

  return ERC20Issuable;
}
