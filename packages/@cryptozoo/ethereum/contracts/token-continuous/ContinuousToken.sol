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

import "./BancorBondingCurve.sol";
import "./interfaces/IContinuousToken.sol";

import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

abstract contract ContinuousToken is IContinuousToken, ERC20Permit, BancorBondingCurve {
  uint256 private _continuousSupply;

  uint256 private _virtualReserveBalance;
  uint256 private immutable _reserveRatio;

  constructor(TokenParams memory tokenParams)
    ERC20(tokenParams.name, tokenParams.symbol)
    ERC20Permit(tokenParams.name)
  {
    _reserveRatio = tokenParams.reserveRatio;
    _virtualReserveBalance = tokenParams.minReserve;
    // _mint(address(this), tokenParams.supply);
    _continuousSupply = tokenParams.supply;
  }

  function reserveRatio() public view virtual override returns (uint256) {
    return _reserveRatio;
  }

  function minimumReserveRequired() public view virtual returns (uint256) {}

  function continuousSupply() public view virtual override returns (uint256) {
    return _continuousSupply; // Continuous Token total supply
  }

  function virtualReserveBalance() public view virtual override returns (uint256) {
    return _virtualReserveBalance;
  }

  function _continuousMinted(
    address account,
    uint256 amount,
    uint256 deposit
  ) internal {
    _continuousSupply += amount;
    _virtualReserveBalance += deposit;
    emit Minted(account, amount, deposit);
  }

  function _continuousBurned(
    address account,
    uint256 amount,
    uint256 refund
  ) internal {
    _continuousSupply -= amount;
    _virtualReserveBalance -= refund;
    emit Burned(account, amount, refund);
  }
}
