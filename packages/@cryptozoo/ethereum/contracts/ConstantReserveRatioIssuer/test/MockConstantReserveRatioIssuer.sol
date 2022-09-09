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

pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "../ConstantReserveRatioIssuer.sol";

contract MockConstantReserveRatioIssuer is ConstantReserveRatioIssuer {
  uint256 private _managedSupply;

  constructor(
    uint32 reserveRatio_,
    uint256 minReserve_,
    uint256 supply_,
    IERC20 reserveToken_,
    ERC20ManagedSupply issueToken_
  ) ConstantReserveRatioIssuer(reserveRatio_, minReserve_, reserveToken_, issueToken_) {
    _managedSupply = supply_;
  }

  function managedSupply() public view virtual override returns (uint256) {
    return _managedSupply;
  }

  function reserveBalance() public view virtual override returns (uint256) {
    return virtualReserveBalance();
  }

  function minimumReserveRequired() public view virtual override returns (uint256) {
    return virtualReserveBalance();
  }

  //Testing Functions for Issue & Redeem Functionality

  function IssueIn(uint256 deposit) external {
    SwapReceipt memory swapReceipt = calcSwap(SwapType.ISSUE, SwapKind.GIVEN_IN, deposit, 0);

    issueToken.mint(msg.sender, swapReceipt.result);
    _managedSupply += swapReceipt.result;

    reserveToken.transferFrom(msg.sender, address(this), deposit);
    _issued(msg.sender, swapReceipt.result, deposit);
  }

  function IssueOut(uint256 request) external {
    SwapReceipt memory swapReceipt = calcSwap(SwapType.ISSUE, SwapKind.GIVEN_OUT, request, 0);

    issueToken.mint(msg.sender, request);
    _managedSupply += request;

    reserveToken.transferFrom(msg.sender, address(this), swapReceipt.result);
    _issued(msg.sender, request, swapReceipt.result);
  }

  function RedeemIn(uint256 deposit) external {
    SwapReceipt memory swapReceipt = calcSwap(SwapType.REDEEM, SwapKind.GIVEN_IN, deposit, 0);

    issueToken.burn(msg.sender, deposit);
    _managedSupply -= deposit;

    reserveToken.transfer(msg.sender, swapReceipt.result);
    _redeemed(msg.sender, deposit, swapReceipt.result);
  }

  function RedeemOut(uint256 request) external {
    SwapReceipt memory swapReceipt = calcSwap(SwapType.REDEEM, SwapKind.GIVEN_OUT, request, 0);

    issueToken.burn(msg.sender, swapReceipt.result);
    _managedSupply -= swapReceipt.result;

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
    amount = calculateBuyExactIn(supply, reserve, reserveRatio, deposit);
  }

  function math_IssueOut(
    uint256 reserveRatio,
    uint256 supply,
    uint256 reserve,
    uint256 request
  ) external view returns (uint256 deposit) {
    deposit = calculateBuyExactOut(supply, reserve, reserveRatio, request);
  }

  function math_RedeemIn(
    uint256 reserveRatio,
    uint256 supply,
    uint256 reserve,
    uint256 deposit
  ) external view returns (uint256 amount) {
    amount = calculateSellExactIn(supply, reserve, reserveRatio, deposit);
  }

  function math_RedeemOut(
    uint256 reserveRatio,
    uint256 supply,
    uint256 reserve,
    uint256 request
  ) external view returns (uint256 deposit) {
    deposit = calculateSellExactOut(supply, reserve, reserveRatio, request);
  }
}
