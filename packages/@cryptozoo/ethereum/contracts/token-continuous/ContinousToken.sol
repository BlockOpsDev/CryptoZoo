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

contract ContinuousToken is IContinuousToken, ERC20Permit, BancorBondingCurve {
  uint256 private _totalSupply;
  uint256 private _reserveBalance;

  constructor(
    string memory _name,
    string memory _symbol,
    uint256 _initialSupply,
    uint32 _reserveRatio
  ) ERC20(_name, _symbol) ERC20Permit(_name) BancorBondingCurve(_reserveRatio) {}

  function init() public override {
    super.init();
    _totalSupply = 139091.002233 ether;
    _reserveBalance = 1;
  }

  function continuousSupply() public view override returns (uint256) {
    return _totalSupply;
  }

  function reserveBalance() public view override returns (uint256) {
    return _reserveBalance;
  }
}
