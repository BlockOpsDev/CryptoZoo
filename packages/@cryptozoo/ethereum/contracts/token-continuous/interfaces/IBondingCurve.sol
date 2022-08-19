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

interface IBondingCurve {
  /**
   * @dev Given a reserve token amount, calculates the amount of continuous tokens returned.
   */
  function mintGivenIn(uint256 _reserveTokenAmount) external view returns (uint256);

  /**
   * @dev Given a desired continuous token amount, calculates the amount of reserve token required.
   */
  function mintGivenOut(uint256 _continuousTokenAmount) external view returns (uint256);

  /**
   * @dev Given a continuous token amount, calculates the amount of reserve tokens returned.
   */
  function burnGivenIn(uint256 _continuousTokenAmount) external view returns (uint256);

  /**
   * @dev Given a desired reserve token amount, calculates the amount of continuous tokens required.
   */
  function burnGivenOut(uint256 _reserveTokenAmount) external view returns (uint256);
}
