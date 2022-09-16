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

import "../../../solidity-utils/math/common/FixedPoint.sol";

import "./ConstantReserveRatioMath.sol";

/**
 * @title ERC20 Issuable Token
 * @notice ERC20 token whose supply is managed by an external IERC20Issuer
 *
 * @dev The Issuer contract should implement IERC20Issuer
 * see ./interfaces/IERC20Issuer for more details
 */
abstract contract CalcSwap is ConstantReserveRatioMath {
  using FixedPoint for uint256;

  /**
   * @dev Enum to select the type of Swap
   * -ISSUE:  swap reserve tokens for continuous tokens
   * -REDEEM: swap continuous tokens for reserve tokens
   */
  enum SwapType {
    ISSUE,
    REDEEM
  }

  /**
   * @dev Enum to select the kind of Swap
   * -GIVEN_IN:  swap is denoted by the exact amount of tokens deposit
   * -GIVEN_OUT: swap is denoted by the exact amount of desired tokens recieved
   */
  enum SwapKind {
    GIVEN_IN,
    GIVEN_OUT
  }

  /**
   * @dev Summary of results from a swap calculation
   * swapType:     Type of swap, see SwapType enum above
   * swapKind:     Kind of swap, see SwapKind enum above
   * result:       resulting value of swap calculation
   * input:        swap input amount
   * supplyDelta:  change in continous token supply
   * reserveDelta: change in reserve token balance
   */
  struct SwapReceipt {
    SwapType swapType;
    SwapKind swapKind;
    uint256 result;
    uint256 input;
    uint256 supplyDelta;
    uint256 reserveDelta;
  }

  /**
   * @dev Calculate swap results and return the SwapReceipt
   * Fees are always taken in the reserve token
   */
  function _calcSwap(
    SwapType swapType,
    SwapKind swapKind,
    uint256 amount,
    uint256 feePercentage
  ) internal view returns (SwapReceipt memory) {
    SwapReceipt memory swapReceipt;
    swapReceipt.swapType = swapType;
    swapReceipt.swapKind = swapKind;
    swapReceipt.input = amount;

    if (swapType == SwapType.ISSUE) {
      if (swapKind == SwapKind.GIVEN_IN) {
        swapReceipt.reserveDelta = _subtractSwapFeeAmount(amount, feePercentage);
        swapReceipt.result = _calculateBuyExactIn(
          virtualSupply(),
          virtualReserveBalance(),
          reserveRatio(),
          swapReceipt.reserveDelta
        );
        swapReceipt.supplyDelta = swapReceipt.result;
      } else {
        swapReceipt.supplyDelta = amount;
        swapReceipt.reserveDelta = _calculateBuyExactOut(
          virtualSupply(),
          virtualReserveBalance(),
          reserveRatio(),
          amount
        );
        swapReceipt.result = _addSwapFeeAmount(swapReceipt.reserveDelta, feePercentage);
      }
    } else {
      if (swapKind == SwapKind.GIVEN_IN) {
        swapReceipt.supplyDelta = amount;
        swapReceipt.reserveDelta = _calculateSellExactIn(
          virtualSupply(),
          virtualReserveBalance(),
          reserveRatio(),
          amount
        );
        swapReceipt.result = _subtractSwapFeeAmount(swapReceipt.reserveDelta, feePercentage);
      } else {
        swapReceipt.reserveDelta = _addSwapFeeAmount(amount, feePercentage);
        swapReceipt.result = _calculateSellExactOut(
          virtualSupply(),
          virtualReserveBalance(),
          reserveRatio(),
          swapReceipt.reserveDelta
        );
        swapReceipt.supplyDelta = swapReceipt.result;
      }
    }

    return swapReceipt;
  }

  /**
   * @dev Adds swap fee amount to `amount`, returning a higher value.
   */
  function _addSwapFeeAmount(uint256 amount, uint256 feePercentage) internal pure returns (uint256) {
    // This returns amount + fee amount, so we round up (favoring a higher fee amount).
    return amount.divUp(feePercentage.complement());
  }

  /**
   * @dev Subtracts swap fee amount from `amount`, returning a lower value.
   */
  function _subtractSwapFeeAmount(uint256 amount, uint256 feePercentage) internal pure returns (uint256) {
    // This returns amount - fee amount, so we round up (favoring a higher fee amount).
    uint256 feeAmount = amount.mulUp(feePercentage);
    return amount.sub(feeAmount);
  }

  /// @dev Functions requiring implementation for calculation

  /**
   * @dev Abstract method that returns reserveRatio
   *
   * reserve ratio, represented in ppm, 1-1000000
   * 1/3 corresponds to y= multiple * x^2
   * 1/2 corresponds to y= multiple * x
   * 2/3 corresponds to y= multiple * x^1/2
   */
  function reserveRatio() public view virtual returns (uint32);

  /**
   * @dev Abstract method that returns virtual continuous token supply
   */
  function virtualSupply() public view virtual returns (uint256);

  /**
   * @dev Abstract method that returns virtual reserve token balance
   */
  function virtualReserveBalance() public view virtual returns (uint256);
}
