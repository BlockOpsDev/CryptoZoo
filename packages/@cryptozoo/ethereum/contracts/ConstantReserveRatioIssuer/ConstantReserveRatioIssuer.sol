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

import "./ConstantReserveRatioSwap.sol";
import "../ERC20ManagedSupply/interfaces/ISupplyManager.sol";
import "../ERC20ManagedSupply/ERC20ManagedSupply.sol";

abstract contract ConstantReserveRatioIssuer is ConstantReserveRatioSwap, ISupplyManager {
  ERC20ManagedSupply public immutable issueToken;
  IERC20 public immutable reserveToken;

  uint32 private immutable _reserveRatio;
  uint256 private _virtualReserveBalance;

  event Issue(address reciever, uint256 amount, uint256 deposit);
  event Redeem(address reciever, uint256 amount, uint256 refund);

  constructor(
    uint32 reserveRatio_,
    uint256 minReserve_,
    IERC20 reserveToken_,
    ERC20ManagedSupply issueToken_
  ) {
    init();
    _virtualReserveBalance = minReserve_;
    _reserveRatio = reserveRatio_;
    issueToken = issueToken_;
    reserveToken = reserveToken_;
  }

  function reserveRatio() public view virtual override returns (uint32) {
    return _reserveRatio;
  }

  function virtualReserveBalance() public view virtual override returns (uint256) {
    return _virtualReserveBalance;
  }

  function virtualSupply() public view virtual override returns (uint256) {
    return managedSupply();
  }

  function _issued(
    address account,
    uint256 amount,
    uint256 deposit
  ) internal {
    _virtualReserveBalance += deposit;
    emit Issue(account, amount, deposit);
  }

  function _redeemed(
    address account,
    uint256 amount,
    uint256 refund
  ) internal {
    _virtualReserveBalance -= refund;
    emit Redeem(account, amount, refund);
  }

  /**
   * @dev Method that returns the amount of tokens currently issued
   */
  function managedSupply() public view virtual returns (uint256);

  /**
   * @dev Method that returns reserve token balance
   */
  function reserveBalance() public view virtual returns (uint256);

  /**
   * @dev Method that returns the minimum balance required in reserveBalance()
   */
  function minimumReserveRequired() public view virtual returns (uint256);
}
