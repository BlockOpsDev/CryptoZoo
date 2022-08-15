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

pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "./BasePool.sol";
import "./interfaces/IMinimalSwapInfoPool.sol";

/**
 * @dev Extension of `BasePool`, adding a handler for `IMinimalSwapInfoPool.onSwap`.
 *
 * Derived contracts must call `BasePool`'s constructor, and implement `_onSwapGivenIn` and `_onSwapGivenOut` along with
 * `BasePool`'s virtual functions. Inheriting from this contract lets derived contracts choose the Two Token or Minimal
 * Swap Info specialization settings.
 */
abstract contract BaseMinimalSwapInfoPool is IMinimalSwapInfoPool, BasePool {
  // Swap Hooks

  function onSwap(
    SwapRequest memory request,
    uint256 balanceTokenIn,
    uint256 balanceTokenOut
  ) public virtual override returns (uint256) {
    _beforeSwapJoinExit();

    if (request.kind == IVault.SwapKind.GIVEN_IN) {
      request.amount = _subtractSwapFeeAmount(request.amount);
      return _onSwapGivenIn(request, balanceTokenIn, balanceTokenOut);
    } else {
      return _addSwapFeeAmount(_onSwapGivenOut(request, balanceTokenIn, balanceTokenOut));
    }
  }

  /*
   * @dev Called when a swap with the Pool occurs, where the amount of tokens entering the Pool is known.
   *
   * Returns the amount of tokens that will be taken from the Pool in return.
   *
   * All amounts inside `swapRequest`, `balanceTokenIn` and `balanceTokenOut` are upscaled. The swap fee has already
   * been deducted from `swapRequest.amount`.
   *
   * The return value is also considered upscaled, and will be downscaled (rounding down) before returning it to the
   * Vault.
   */
  function _onSwapGivenIn(
    SwapRequest memory swapRequest,
    uint256 balanceTokenIn,
    uint256 balanceTokenOut
  ) internal virtual returns (uint256);

  /*
   * @dev Called when a swap with the Pool occurs, where the amount of tokens exiting the Pool is known.
   *
   * Returns the amount of tokens that will be granted to the Pool in return.
   *
   * All amounts inside `swapRequest`, `balanceTokenIn` and `balanceTokenOut` are upscaled.
   *
   * The return value is also considered upscaled, and will be downscaled (rounding up) before applying the swap fee
   * and returning it to the Vault.
   */
  function _onSwapGivenOut(
    SwapRequest memory swapRequest,
    uint256 balanceTokenIn,
    uint256 balanceTokenOut
  ) internal virtual returns (uint256);
}
