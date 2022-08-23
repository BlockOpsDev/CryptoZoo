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

import "hardhat/console.sol";

import "./BancorBondingCurve.sol";
import "./interfaces/IContinuousToken.sol";

import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

abstract contract ContinuousToken is IContinuousToken, ERC20Permit, BancorBondingCurve {
  uint256 private _virtualReserveBalance;
  uint256 private immutable _reserveRatio;

  constructor(
    string memory name,
    string memory symbol,
    uint256 minReserve,
    uint256 supply,
    uint256 ratio
  ) ERC20(name, symbol) ERC20Permit(name) {
    _reserveRatio = ratio;
    _virtualReserveBalance = minReserve;
    _mint(address(this), supply);
  }

  function reserveRatio() public view virtual override returns (uint256) {
    return _reserveRatio;
  }

  function continuousSupply() public view virtual override returns (uint256) {
    return totalSupply(); // Continuous Token total supply
  }

  function minimumReserveRequired() public view virtual returns (uint256) {}

  function virtualReserveBalance() public view virtual override returns (uint256) {
    return _virtualReserveBalance;
  }

  function _increaseVirtualReserve(uint256 amount) internal {
    _virtualReserveBalance += amount;
  }

  function _decreaseVirtualReserve(uint256 amount) internal {
    _virtualReserveBalance -= amount;
  }

  function _continuousMinted(
    address account,
    uint256 amount,
    uint256 deposit
  ) internal {
    _increaseVirtualReserve(deposit);
    emit Minted(account, amount, deposit);
  }

  function _continuousBurned(
    address account,
    uint256 amount,
    uint256 refund
  ) internal {
    _decreaseVirtualReserve(refund);
    emit Burned(account, amount, refund);
  }
}
