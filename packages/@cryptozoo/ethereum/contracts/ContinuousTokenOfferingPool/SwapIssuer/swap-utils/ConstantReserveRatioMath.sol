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

import "../../../solidity-utils/math/AnalyticMath.sol";

/**
 * @title Constant Reserve Ratio Math
 * @notice Formulas for a Continous Token Offering
 */
contract ConstantReserveRatioMath is AnalyticMath {
  uint256 private constant MIN_WEIGHT = 1;
  uint256 private constant MAX_WEIGHT = 1000000;

  modifier validateInputs(
    uint256 supply,
    uint256 reserveBalance,
    uint256 reserveRatio
  ) {
    require(
      supply > 0 && reserveBalance > 0 && MIN_WEIGHT <= reserveRatio && reserveRatio <= MAX_WEIGHT,
      "Invalid inputs."
    );
    _;
  }

  /**
   * @dev given a continuous token supply, reserve token balance, reserve ratio, and a deposit amount (in the reserve token),
   * calculates the return (in the continuous token)
   *
   * Formula:
   * Return = supply * ((1 + depositAmount / reserveBalance) ^ (reserveRatio / MAX_WEIGHT) - 1)
   *
   * @param supply           continuous token total supply
   * @param reserveBalance   total reserve token balance
   * @param reserveRatio     reserve ratio, represented in ppm, 1-1000000
   * @param depositAmount    deposit amount, in reserve token
   *
   * @return amount          return amount, in continuous token
   */
  function calculateBuyExactIn(
    uint256 supply,
    uint256 reserveBalance,
    uint256 reserveRatio,
    uint256 depositAmount
  ) internal view validateInputs(supply, reserveBalance, reserveRatio) returns (uint256) {
    unchecked {
      if (depositAmount == 0) return 0;

      if (reserveRatio == MAX_WEIGHT) return IntegralMath.mulDivF(depositAmount, supply, reserveBalance);

      (uint256 n, uint256 d) = pow(safeAdd(reserveBalance, depositAmount), reserveBalance, reserveRatio, MAX_WEIGHT);
      return IntegralMath.mulDivF(supply, n, d) - supply;
    }
  }

  /**
   * @dev given a continuous token supply, reserve token balance, reserve ratio, and a desired return amount (in the continuous token),
   * calculates the deposit amount needed (in the reserve token)
   *
   * Formula:
   * Deposit = reserveBalance * ((1 + returnAmount / supply) ^ (MAX_WEIGHT / reserveRatio) - 1)
   *
   * @param supply           continuous token total supply
   * @param reserveBalance   total reserve token balance
   * @param reserveRatio     reserve ratio, represented in ppm, 1-1000000
   * @param returnAmount     desired continuous token return amount
   *
   * @return amount          deposit amount, in reserve token
   */
  function calculateBuyExactOut(
    uint256 supply,
    uint256 reserveBalance,
    uint256 reserveRatio,
    uint256 returnAmount
  ) internal view validateInputs(supply, reserveBalance, reserveRatio) returns (uint256) {
    unchecked {
      if (returnAmount == 0) return 0;

      if (reserveRatio == MAX_WEIGHT) return IntegralMath.mulDivF(returnAmount, reserveBalance, supply);

      (uint256 n, uint256 d) = pow(safeAdd(supply, returnAmount), supply, MAX_WEIGHT, reserveRatio);
      return IntegralMath.mulDivF(reserveBalance, n, d) - reserveBalance;
    }
  }

  /**
   * @dev given a continuous token supply, reserve token balance, reserve ratio and a sell amount (in the continuous token),
   * calculates the return (in the reserve token)
   *
   * Formula:
   * Return = reserveBalance * (1 - (1 - sellAmount / supply) ^ (MAX_WEIGHT / reserveRatio))
   *
   * @param supply           continuous token total supply
   * @param reserveBalance   total reserve token balance
   * @param reserveRatio     constant reserve ratio, represented in ppm, 1-1000000
   * @param sellAmount       sell amount, in continuous token
   *
   * @return amount          return amount, in reserve token
   */
  function calculateSellExactIn(
    uint256 supply,
    uint256 reserveBalance,
    uint256 reserveRatio,
    uint256 sellAmount
  ) internal view validateInputs(supply, reserveBalance, reserveRatio) returns (uint256) {
    unchecked {
      require(sellAmount <= supply, "invalid amount");

      if (sellAmount == 0) return 0;

      if (sellAmount == supply) return reserveBalance;

      if (reserveRatio == MAX_WEIGHT) return IntegralMath.mulDivF(sellAmount, reserveBalance, supply);

      (uint256 n, uint256 d) = pow(supply, supply - sellAmount, MAX_WEIGHT, reserveRatio);
      return IntegralMath.mulDivF(reserveBalance, n - d, n);
    }
  }

  /**
   * @dev given a continuous token supply, reserve token balance, reserve ratio, and a desired return amount (in the reserve token),
   * calculates the sell amount needed (in the continuous token)
   *
   * Formula:
   * Return = supply * (-(1 - returnAmount / reserveBalance) ^ (reserveRatio / MAX_WEIGHT) - 1)
   *
   * @param supply           continuous token total supply
   * @param reserveBalance   total reserve token balance
   * @param reserveRatio     constant reserve ratio, represented in ppm, 1-1000000
   * @param returnAmount     return amount, in reserve token
   *
   * @return amount          sell amount, in reserve token
   */
  function calculateSellExactOut(
    uint256 supply,
    uint256 reserveBalance,
    uint256 reserveRatio,
    uint256 returnAmount
  ) internal view validateInputs(supply, reserveBalance, reserveRatio) returns (uint256) {
    unchecked {
      require(returnAmount <= reserveBalance, "invalid amount");

      if (returnAmount == 0) return 0;

      if (reserveRatio == MAX_WEIGHT) return IntegralMath.mulDivF(returnAmount, supply, reserveBalance);

      (uint256 n, uint256 d) = pow(reserveBalance, reserveBalance - returnAmount, reserveRatio, MAX_WEIGHT);
      return IntegralMath.mulDivF(supply, n - d, n);
    }
  }
}
