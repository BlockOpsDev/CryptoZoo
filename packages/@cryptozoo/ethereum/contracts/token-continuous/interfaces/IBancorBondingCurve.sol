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

interface IBancorBondingCurve {
  enum bondSwapKind {
    MINT_GIVIN_IN,
    MINT_GIVIN_OUT,
    BURN_GIVIN_IN,
    BURN_GIVIN_OUT
  }

  /**
   * @dev Method that returns reserveRatio
   *
   * reserve ratio, represented in ppm, 1-1000000
   * 1/3 corresponds to y= multiple * x^2
   * 1/2 corresponds to y= multiple * x
   * 2/3 corresponds to y= multiple * x^1/2
   */
  function reserveRatio() external view returns (uint256);

  /**
   * @dev Method that returns continuous token supply
   */
  function continuousSupply() external view returns (uint256);

  /**
   * @dev Method that returns reserve token balance
   */
  function reserveBalance() external view returns (uint256);

  /**
   * @dev Method that returns virtual reserve token balance used for bancor formula
   */
  function virtualReserveBalance() external view returns (uint256);
}
