export {};
// // import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
// // import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs';
// import { expect } from 'chai';
// // import { ethers } from 'hardhat';
// import { Vault } from '@balancer-labs/typechain';
// import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
// import { TokenList, setupEnvironment, pickTokens, ZERO_ADDRESS } from '../balancer';
// import { Keeper, MockToken } from '../typechain-types';
// import { ethers } from 'hardhat';

// describe('Balancer', function () {
//   let vault: Vault;
//   let tokenList: TokenList;
//   let tokens: MockToken[];
//   let deployer: SignerWithAddress;
//   let liquidityProvider: SignerWithAddress;
//   let trader: SignerWithAddress;
//   let pool: Keeper;

//   beforeEach('deploy tokens', async () => {
//     ({ vault, tokens: tokenList, deployer, trader, liquidityProvider } = await setupEnvironment());
//     tokens = pickTokens(tokenList, 2);
//     const Pool = await ethers.getContractFactory('Keeper');
//     const pool = await Pool.deploy(
//       vault.address,
//       'Keeper',
//       'KPR',
//       tokens.map((token) => token.address),
//       new Array(2).fill(ZERO_ADDRESS),
//       ethers.utils.parseUnits('1', 17),
//       0,
//       0,
//       liquidityProvider.address
//     );
//   });

//   describe('Deployment', function () {
//     // console.log(tokenAddresses);
//     it('Should Check Balancer Deployment', async function () {
//       console.log(await tokens[0].symbol());
//       // const { reserveToken, continousToken } = await loadFixture(deployContinuousTokenAndReserve);

//       // expect(await reserveToken.balanceOf(continousToken.address)).to.equal(ethers.utils.parseEther('160000'));

//       expect(1).to.equal(1);
//     });
//   });
// });
