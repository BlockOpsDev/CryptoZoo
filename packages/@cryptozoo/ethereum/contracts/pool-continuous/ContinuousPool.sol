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

import "@balancer-labs/ethereum/contracts/solidity-utils/helpers/InputHelpers.sol";

import "./interfaces/IContinuousPool.sol";
import "../pool-utils/BaseMinimalSwapInfoPool.sol";

import "./helpers/ContinuousPoolUserData.sol";
import "./helpers/ERC20Helpers.sol";

import "../token-continuous/ContinuousToken.sol";

abstract contract ContinuousPool is IContinuousPool, BaseMinimalSwapInfoPool, ContinuousToken {
  using ContinuousPoolUserData for bytes;

  IERC20 private immutable _reserveToken;

  uint256 private immutable _continuousIndex;
  uint256 private immutable _reserveIndex;

  constructor(PoolParams memory poolParams)
    BasePool(
      poolParams.vault,
      IVault.PoolSpecialization.TWO_TOKEN,
      _sortTokens(poolParams.reserveToken, this),
      poolParams.assetManagers,
      poolParams.swapFeePercentage,
      poolParams.pauseWindowDuration,
      poolParams.bufferPeriodDuration,
      poolParams.owner
    )
  {
    _reserveToken = poolParams.reserveToken;

    (uint256 reserveIndex, uint256 continuousIndex) = _getSortedTokenIndexes(poolParams.reserveToken, this);
    _reserveIndex = reserveIndex;
    _continuousIndex = continuousIndex;
  }

  /**
   * @notice Return the reserve token address as an IERC20.
   */
  function getReserveToken() public view override returns (IERC20) {
    return _reserveToken;
  }

  /**
   * @notice Return the index of the reserve token.
   * @dev Note that this is an index into the registered token list (with 2 tokens).
   */
  function getReserveIndex() external view override returns (uint256) {
    return _reserveIndex;
  }

  /**
   * @notice Return the index of the continuous token.
   * @dev Note that this is an index into the registered token list (with 2 tokens).
   */
  function getContinuousIndex() public view override returns (uint256) {
    return _continuousIndex;
  }

  function _getTotalTokens() internal pure override returns (uint256) {
    return 2;
  }

  function _getMaxTokens() internal pure override returns (uint256) {
    return 2;
  }

  function reserveBalance() public view virtual override returns (uint256) {
    uint256[] memory balances;
    (, balances, ) = getVault().getPoolTokens(getPoolId());
    return balances[_reserveIndex];
  }

  //Implement Base Pool Handlers

  // Swap Handlers
  function _onSwapGivenIn(
    SwapRequest memory swapRequest,
    uint256,
    uint256
  ) internal virtual override returns (uint256) {
    // Swaps are disabled while the contract is paused.
    bool isMint = swapRequest.tokenIn == _reserveToken;
    uint256[] memory balanceDeltas = new uint256[](2);

    uint256 amount;

    if (isMint) {
      amount = getContinuousSwap(bondSwapKind.MINT_GIVIN_IN, swapRequest.amount);

      balanceDeltas[_reserveIndex] = swapRequest.amount;
      balanceDeltas[_continuousIndex] = amount;
    } else {
      amount = getContinuousSwap(bondSwapKind.BURN_GIVIN_IN, swapRequest.amount);

      balanceDeltas[_reserveIndex] = amount;
      balanceDeltas[_continuousIndex] = swapRequest.amount;
    }

    _afterSwap(isMint, swapRequest.to, balanceDeltas);

    return amount;
  }

  function _onSwapGivenOut(
    SwapRequest memory swapRequest,
    uint256,
    uint256
  ) internal virtual override returns (uint256) {
    // Swaps are disabled while the contract is paused.

    bool isMint = swapRequest.tokenIn == _reserveToken;
    uint256[] memory balanceDeltas = new uint256[](2);

    uint256 amount;

    if (isMint) {
      amount = getContinuousSwap(bondSwapKind.MINT_GIVIN_OUT, swapRequest.amount);

      balanceDeltas[_reserveIndex] = swapRequest.amount;
      balanceDeltas[_continuousIndex] = amount;
    } else {
      amount = getContinuousSwap(bondSwapKind.BURN_GIVIN_OUT, swapRequest.amount);

      balanceDeltas[_reserveIndex] = amount;
      balanceDeltas[_continuousIndex] = swapRequest.amount;
    }

    _afterSwap(isMint, swapRequest.to, balanceDeltas);

    return amount;
  }

  function _onJoinPool(
    bytes32,
    address,
    address,
    uint256[] memory,
    uint256,
    uint256,
    bytes memory
  ) internal pure override returns (uint256[] memory) {
    _revert(Errors.UNHANDLED_JOIN_KIND);
  }

  function _onExitPool(
    bytes32,
    address sender,
    address,
    uint256[] memory balances,
    uint256,
    uint256 protocolSwapFeePercentage,
    bytes memory userData
  ) internal virtual override returns (uint256[] memory) {
    _require(sender == getOwner(), Errors.UNHANDLED_EXIT_KIND);

    _beforeJoinExit(balances, protocolSwapFeePercentage);

    uint256[] memory amountsOut = new uint256[](balances.length);
    amountsOut[_reserveIndex] = 1e18;

    _afterJoinExit(false, balances, amountsOut);

    return (amountsOut);
  }

  //Hooks
  /**
   * @dev Called before any join or exit operation. Empty by default, but derived contracts may choose to add custom
   * behavior at these steps. This often has to do with protocol fee processing.
   */
  function _beforeJoinExit(uint256[] memory preBalances, uint256 protocolSwapFeePercentage) internal virtual {
    // solhint-disable-previous-line no-empty-blocks
  }

  /**
   * @dev Called after any join or exit operation (including initialization). Empty by default, but derived contracts
   * may choose to add custom behavior at these steps. This often has to do with protocol fee processing.
   *
   * If isJoin is true, balanceDeltas are the amounts in: otherwise they are the amounts out.
   *
   * This function is free to mutate the `preBalances` array.
   */
  function _afterJoinExit(
    bool isJoin,
    uint256[] memory preBalances,
    uint256[] memory balanceDeltas
  ) internal virtual {
    // solhint-disable-previous-line no-empty-blocks
  }

  /**
   * @dev Called after any swap (including initialization).
   *
   * If isMint is true, balanceDeltas are the amounts increase of reserve token and continuous token. (amount decrease otherwise)
   *
   */
  function _afterSwap(
    bool isMint,
    address account,
    uint256[] memory balanceDeltas
  ) internal virtual {
    if (isMint) {
      _continuousMinted(account, balanceDeltas[_continuousIndex], balanceDeltas[_reserveIndex]);
    } else {
      _continuousBurned(account, balanceDeltas[_continuousIndex], balanceDeltas[_reserveIndex]);
    }
  }
}
