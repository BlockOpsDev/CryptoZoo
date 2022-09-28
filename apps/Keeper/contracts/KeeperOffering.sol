// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@cryptozoo/ethereum/contracts/ERC20Retire/ERC20Retire.sol";

import "@cryptozoo/ethereum/contracts/ContinuousTokenOfferingPool/ContinuousTokenOfferingPool.sol";

contract KeeperOffering is ContinuousTokenOfferingPool {
  constructor(PoolParams memory poolParams, SwapIssuerParams memory swapIssuerParams)
    ContinuousTokenOfferingPool(poolParams, swapIssuerParams)
  {}

  function minimumReserveRequired() public view virtual override returns (uint256) {
    return
      _calculateSellExactIn(
        virtualSupply(),
        virtualReserveBalance(),
        reserveRatio(),
        ERC20Retire(address(issueToken)).circulatingSupply()
      );
  }
}
