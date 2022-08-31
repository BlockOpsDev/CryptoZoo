import { Dictionary, fromPairs } from 'lodash';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { BigNumber } from '@ethersproject/bignumber';
import { MaxUint256 } from '@ethersproject/constants';
import { JsonFragment } from '@ethersproject/abi';
import { getBalancerContractAbi, getBalancerContractBytecode } from '@balancer-labs/v2-deployments';
import { Vault } from '@balancer-labs/typechain';
import * as MockTokenArtifact from '../artifacts/contracts/mock/MockToken.sol/MockToken.json';
import * as MockWETHArtifact from '../artifacts/contracts/mock/MockWETH.sol/MockWETH.json';
import { MockToken, MockWETH } from '../typechain-types';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const ZERO_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000';

export type TokenList = Dictionary<MockToken>;

export const tokenSymbols = Array.from({ length: 2 }, (_, i) => `TKN${i}`);

export const getBalancerContractArtifact = async (
  task: string,
  contract: string
): Promise<{ bytecode: string; abi: JsonFragment[] }> => {
  const abi = getBalancerContractAbi(task, contract) as Promise<JsonFragment[]>;
  const bytecode = getBalancerContractBytecode(task, contract);

  return { abi: await abi, bytecode: await bytecode };
};

export async function deployVault(weth: MockWETH, admin: string, from?: SignerWithAddress): Promise<Vault> {
  const [defaultDeployer] = await ethers.getSigners();
  const deployer = from || defaultDeployer;

  const authorizerArtifact = await getBalancerContractArtifact('20210418-authorizer', 'Authorizer');
  const authorizerFactory = new ethers.ContractFactory(authorizerArtifact.abi, authorizerArtifact.bytecode, deployer);
  const authorizer = await authorizerFactory.deploy(admin);

  const vaultArtifact = await getBalancerContractArtifact('20210418-vault', 'Vault');
  const vaultFactory = new ethers.ContractFactory(vaultArtifact.abi, vaultArtifact.bytecode, deployer);
  const vault = await vaultFactory.deploy(authorizer.address, weth.address, 0, 0);

  return vault as Vault;
}

export async function setupEnvironment(
  deployer: SignerWithAddress,
  admin: SignerWithAddress,
  users: SignerWithAddress[]
): Promise<{
  vault: Vault;
  tokens: TokenList;
  weth: MockWETH;
}> {
  const weth = await deployWETH(deployer);
  const vault = await deployVault(weth, admin.address);
  const tokens = await deploySortedTokens(tokenSymbols, Array(tokenSymbols.length).fill(18));

  for (const symbol in tokens) {
    for (const user of users) {
      await mintTokens(tokens, symbol, user, ethers.utils.parseEther('1200'));
      await tokens[symbol].connect(user).approve(vault.address, MaxUint256);
    }
  }

  return { vault, tokens, weth };
}

export function pickTokens(tokens: TokenList, size: number, offset?: number): MockToken[] {
  return tokenSymbols.slice(offset ?? 0, size + (offset ?? 0)).map((symbol) => tokens[symbol]);
}

export async function deploySortedTokens(
  symbols: Array<string>,
  decimals: Array<number>,
  from?: SignerWithAddress
): Promise<TokenList> {
  const [defaultDeployer] = await ethers.getSigners();
  const deployer = from || defaultDeployer;

  return fromPairs(
    (await Promise.all(symbols.map((_, i) => deployToken(`T${i}`, deployer))))
      .sort((tokenA, tokenB) => (tokenA.address.toLowerCase() > tokenB.address.toLowerCase() ? 1 : -1))
      .map((token, index) => [symbols[index], token])
  );
}

export async function deployWETH(from?: SignerWithAddress): Promise<MockWETH> {
  const [defaultDeployer] = await ethers.getSigners();
  const deployer = from || defaultDeployer;

  const factory = new ethers.ContractFactory(MockWETHArtifact.abi, MockWETHArtifact.bytecode, deployer);
  const instance = (await factory.deploy(deployer.address)) as MockWETH;
  return instance;
}

export async function deployToken(symbol: string, from?: SignerWithAddress): Promise<MockToken> {
  const [defaultDeployer] = await ethers.getSigners();
  const deployer = from || defaultDeployer;

  const factory = new ethers.ContractFactory(MockTokenArtifact.abi, MockTokenArtifact.bytecode, deployer);
  const instance = (await factory.deploy(deployer.address, symbol, symbol)) as MockToken;
  return instance;
}

export async function mintTokens(
  tokens: TokenList,
  symbol: string,
  recipient: SignerWithAddress | string,
  amount: number | BigNumber | string
): Promise<void> {
  await tokens[symbol].mint(typeof recipient == 'string' ? recipient : recipient.address, amount.toString());
}
