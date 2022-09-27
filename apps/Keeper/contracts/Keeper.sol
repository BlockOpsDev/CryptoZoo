// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@cryptozoo/ethereum/contracts/ERC20Issuable/ERC20Issuable.sol";
import "@cryptozoo/ethereum/contracts/ERC20Retire/ERC20Retire.sol";

contract Keeper is ERC20Issuable, ERC20Retire {
  constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

  function totalSupply() public view virtual override(ERC20, ERC20Issuable) returns (uint256) {
    return super.totalSupply();
  }

  function _transfer(
    address from,
    address to,
    uint256 amount
  ) internal virtual override(ERC20, ERC20Retire) {
    super._transfer(from, to, amount);
  }
}
