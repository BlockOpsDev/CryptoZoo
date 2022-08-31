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
pragma experimental ABIEncoderV2;

import "@balancer-labs/ethereum/contracts/interfaces/vault/IVault.sol";
import "@balancer-labs/ethereum/contracts/interfaces/vault/IPoolSwapStructs.sol";

/**
 * @dev Interface for adding and removing liquidity that all Pool contracts should implement. Note that this is not
 * the complete Pool contract interface, as it is missing the swap hooks. Pool contracts should also inherit from
 * either IGeneralPool or IMinimalSwapInfoPool
 */
interface IContinuousPool {
  struct PoolParams {
    IVault vault;
    address[] assetManagers;
    uint256 swapFeePercentage;
    uint256 pauseWindowDuration;
    uint256 bufferPeriodDuration;
    address owner;
  }

  /**
   * @dev Returns the index of the reserve token in the Pool tokens array (as returned by IVault.getPoolTokens).
   */
  function getReserveIndex() external view returns (uint256);

  /**
   * @dev Returns the index of the continuous token in the Pool tokens array (as returned by IVault.getPoolTokens).
   */
  function getContinuousIndex() external view returns (uint256);
}
