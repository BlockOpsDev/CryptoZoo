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

import "../math-utils/BancorFormula.sol";

abstract contract BancorBondingCurve is BancorFormula {
  /*
    reserve ratio, represented in ppm, 1-1000000
    1/3 corresponds to y= multiple * x^2
    1/2 corresponds to y= multiple * x
    2/3 corresponds to y= multiple * x^1/2
  */
  uint32 public reserveRatio;

  constructor(uint32 _reserveRatio) {
    reserveRatio = _reserveRatio;
  }

  function mintGivenIn(uint256 _reserveTokenAmount) public view returns (uint256) {
    return calculatePurchaseReturn(continuousSupply(), reserveBalance(), reserveRatio, _reserveTokenAmount);
  }

  function burnGivenIn(uint256 _continuousTokenAmount) public view returns (uint256) {
    return calculateSaleReturn(continuousSupply(), reserveBalance(), reserveRatio, _continuousTokenAmount);
  }

  function mintGivenOut(uint256 _continuousTokenAmount) public view returns (uint256) {
    return calculateSaleReturn(continuousSupply(), reserveBalance(), reserveRatio, _continuousTokenAmount);
  }

  function burnGivenOut(uint256 _reserveTokenAmount) public view returns (uint256) {
    return calculatePurchaseReturn(continuousSupply(), reserveBalance(), reserveRatio, _reserveTokenAmount);
  }

  /**
   * @dev Abstract method that returns continuous token supply
   */
  function continuousSupply() public view virtual returns (uint256);

  /**
   * @dev Abstract method that returns reserve token balance
   */
  function reserveBalance() public view virtual returns (uint256);
}
