// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "@cryptozoo/ethereum/contracts/Mock/MockToken.sol";

contract TLock is MockToken {
  constructor(
    address admin,
    string memory name,
    string memory symbol,
    uint8 decimals
  ) MockToken(admin, name, symbol, decimals) {}
}
