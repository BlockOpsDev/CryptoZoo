// SPDX-License-Identifier: GPL-3.0-or-later
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "../SwapIssuer.sol";

contract MockSwapIssuer is SwapIssuer {
  uint256 private _totalSupplyIssued;

  constructor(SwapIssuerParams memory swapIssuerParams, uint256 supply) SwapIssuer(swapIssuerParams) {
    _totalSupplyIssued = supply;
  }

  function totalSupplyIssued() public view virtual override returns (uint256) {
    return _totalSupplyIssued;
  }

  function reserveBalance() public view virtual override returns (uint256) {
    return virtualReserveBalance();
  }

  function minimumReserveRequired() public view virtual override returns (uint256) {
    return virtualReserveBalance();
  }

  //Testing Functions for Issue & Redeem Functionality

  function IssueIn(uint256 deposit) external {
    SwapReceipt memory swapReceipt = _calcSwap(SwapType.ISSUE, SwapKind.GIVEN_IN, deposit, 0);

    issueToken.mint(msg.sender, swapReceipt.result);
    _totalSupplyIssued += swapReceipt.result;

    reserveToken.transferFrom(msg.sender, address(this), deposit);
    _issued(msg.sender, swapReceipt.result, deposit);
  }

  function IssueOut(uint256 request) external {
    SwapReceipt memory swapReceipt = _calcSwap(SwapType.ISSUE, SwapKind.GIVEN_OUT, request, 0);

    issueToken.mint(msg.sender, request);
    _totalSupplyIssued += request;

    reserveToken.transferFrom(msg.sender, address(this), swapReceipt.result);
    _issued(msg.sender, request, swapReceipt.result);
  }

  function RedeemIn(uint256 deposit) external {
    SwapReceipt memory swapReceipt = _calcSwap(SwapType.REDEEM, SwapKind.GIVEN_IN, deposit, 0);

    issueToken.burn(msg.sender, deposit);
    _totalSupplyIssued -= deposit;

    reserveToken.transfer(msg.sender, swapReceipt.result);
    _redeemed(msg.sender, deposit, swapReceipt.result);
  }

  function RedeemOut(uint256 request) external {
    SwapReceipt memory swapReceipt = _calcSwap(SwapType.REDEEM, SwapKind.GIVEN_OUT, request, 0);

    issueToken.burn(msg.sender, swapReceipt.result);
    _totalSupplyIssued -= swapReceipt.result;

    reserveToken.transfer(msg.sender, request);
    _redeemed(msg.sender, swapReceipt.result, request);
  }

  //Testing Functions for Curve Math

  function math_IssueIn(
    uint256 reserveRatio,
    uint256 supply,
    uint256 reserve,
    uint256 deposit
  ) external view returns (uint256 amount) {
    amount = _calculateBuyExactIn(supply, reserve, reserveRatio, deposit);
  }

  function math_IssueOut(
    uint256 reserveRatio,
    uint256 supply,
    uint256 reserve,
    uint256 request
  ) external view returns (uint256 deposit) {
    deposit = _calculateBuyExactOut(supply, reserve, reserveRatio, request);
  }

  function math_RedeemIn(
    uint256 reserveRatio,
    uint256 supply,
    uint256 reserve,
    uint256 deposit
  ) external view returns (uint256 amount) {
    amount = _calculateSellExactIn(supply, reserve, reserveRatio, deposit);
  }

  function math_RedeemOut(
    uint256 reserveRatio,
    uint256 supply,
    uint256 reserve,
    uint256 request
  ) external view returns (uint256 deposit) {
    deposit = _calculateSellExactOut(supply, reserve, reserveRatio, request);
  }
}
