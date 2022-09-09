import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';

import { MockERC20ManagedSupply } from '../../typechain-types';

export async function deploy_MockERC20ManagedSupply(
  deployer: SignerWithAddress,
  name: string,
  symbol: string
): Promise<MockERC20ManagedSupply> {
  const ERC20ManagedSupplyFactory = await ethers.getContractFactory('MockERC20ManagedSupply');
  const ERC20ManagedSupply = await ERC20ManagedSupplyFactory.connect(deployer).deploy(name, symbol);

  return ERC20ManagedSupply;
}
