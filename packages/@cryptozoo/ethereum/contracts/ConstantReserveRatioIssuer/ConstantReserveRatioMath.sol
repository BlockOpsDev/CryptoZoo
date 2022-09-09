// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.14;

import "../math-utils/AnalyticMath.sol";

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
   * calculates the return for a given conversion (in the continuous token)
   *
   * Formula:
   * Return = supply * ((1 + depositAmount / reserveBalance) ^ (reserveRatio / MAX_WEIGHT) - 1)
   *
   * @param supply           continuous token total supply
   * @param reserveBalance   total reserve token balance
   * @param reserveRatio     reserve ratio, represented in ppm, 1-1000000
   * @param depositAmount    deposit amount, in reserve token
   *
   * @return amount          continuous token return amount
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
   * calculates the deposit amount need (in the reserve token)
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
   * calculates the return for a given conversion (in the reserve token)
   *
   * Formula:
   * Return = reserveBalance * (1 - (1 - sellAmount / supply) ^ (MAX_WEIGHT / reserveRatio))
   *
   * @param supply           continuous token total supply
   * @param reserveBalance   total reserve token balance
   * @param reserveRatio     constant reserve ratio, represented in ppm, 1-1000000
   * @param sellAmount       sell amount, in continuous token
   *
   * @return amount          reserve token return amount
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
   * @dev given a continuous token supply, reserve token balance, reserve ratio and a sell amount (in the continuous token),
   * calculates the return for a given conversion (in the reserve token)
   *
   * Formula:
   * Return = reserveBalance * (1 - (1 - sellAmount / supply) ^ (MAX_WEIGHT / reserveRatio))
   *
   * @param supply           continuous token total supply
   * @param reserveBalance   total reserve token balance
   * @param reserveRatio     constant reserve ratio, represented in ppm, 1-1000000
   * @param sellAmount       sell amount, in continuous token
   *
   * @return amount          reserve token return amount
   */
  function calculateSellExactOut(
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
}
