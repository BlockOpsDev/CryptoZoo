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

import "../pool-utils/BasePool.sol";
import "../pool-utils/interfaces/IMinimalSwapInfoPool.sol";

import "../ConstantReserveRatioIssuer/ConstantReserveRatioIssuer.sol";

abstract contract BalancerSwapIssuer is IMinimalSwapInfoPool, BasePool, ConstantReserveRatioIssuer {
  // Swap Hook
  function onSwap(
    SwapRequest memory request,
    uint256,
    uint256
  ) public virtual override onlyVault(request.poolId) returns (uint256) {
    _beforeSwapJoinExit();

    SwapType swapType = request.tokenIn == reserveToken ? SwapType.ISSUE : SwapType.REDEEM;

    SwapReceipt memory swapReceipt = calcSwap(
      swapType,
      SwapKind(uint8(request.kind)),
      request.amount,
      getSwapFeePercentage()
    );

    _afterSwap(request.to, swapReceipt);

    return swapReceipt.result;
  }

  /**
   * @dev Called after any swap (including initialization).
   *
   */
  function _afterSwap(address account, SwapReceipt memory swapReceipt) internal virtual {
    if (swapReceipt.swapType == SwapType.ISSUE) {
      _issued(account, swapReceipt.supplyDelta, swapReceipt.reserveDelta);
    } else {
      _redeemed(account, swapReceipt.supplyDelta, swapReceipt.reserveDelta);
    }
  }
}
