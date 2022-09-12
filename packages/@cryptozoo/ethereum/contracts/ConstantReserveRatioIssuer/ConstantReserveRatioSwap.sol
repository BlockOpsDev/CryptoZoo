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

import "@balancer-labs/ethereum/contracts/solidity-utils/math/FixedPoint.sol";

import "./ConstantReserveRatioMath.sol";

abstract contract ConstantReserveRatioSwap is ConstantReserveRatioMath {
  using FixedPoint for uint256;

  enum SwapType {
    ISSUE,
    REDEEM
  }

  enum SwapKind {
    GIVEN_IN,
    GIVEN_OUT
  }

  struct SwapReceipt {
    SwapType swapType;
    SwapKind swapKind;
    uint256 result;
    uint256 input;
    uint256 supplyDelta;
    uint256 reserveDelta;
  }

  /**
   * @dev Calculate Swap Amounts
   */
  function calcSwap(
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
        swapReceipt.result = calculateBuyExactIn(
          virtualSupply(),
          virtualReserveBalance(),
          reserveRatio(),
          swapReceipt.reserveDelta
        );
        swapReceipt.supplyDelta = swapReceipt.result;
      } else {
        swapReceipt.supplyDelta = amount;
        swapReceipt.reserveDelta = calculateBuyExactOut(
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
        swapReceipt.reserveDelta = calculateSellExactIn(
          virtualSupply(),
          virtualReserveBalance(),
          reserveRatio(),
          amount
        );
        swapReceipt.result = _subtractSwapFeeAmount(swapReceipt.reserveDelta, feePercentage);
      } else {
        swapReceipt.reserveDelta = _addSwapFeeAmount(amount, feePercentage);
        swapReceipt.result = calculateSellExactOut(
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

  //Functions required for calculation

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
   * @dev Abstract method that returns continuous token supply
   */
  function virtualSupply() public view virtual returns (uint256);

  /**
   * @dev Abstract method that returns virtual reserve token balance used for bancor formula
   */
  function virtualReserveBalance() public view virtual returns (uint256);
}
