import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';

import { MockERC20Retire } from '../../typechain-types';

export async function deploy_MockERC20Retire(
  deployer: SignerWithAddress,
  name: string,
  symbol: string
): Promise<MockERC20Retire> {
  const ERC20RetireFactory = await ethers.getContractFactory('MockERC20Retire');
  const ERC20Retire = await ERC20RetireFactory.connect(deployer).deploy(name, symbol);

  return <MockERC20Retire>ERC20Retire;
}
