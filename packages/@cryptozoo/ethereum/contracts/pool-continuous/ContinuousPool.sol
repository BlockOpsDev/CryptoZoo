// SPDX-License-Identifier: Unlicenced

pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

// import "@balancer-labs/v2-solidity-utils/contracts/math/FixedPoint.sol";
import "@balancer-labs/ethereum/contracts/solidity-utils/helpers/InputHelpers.sol";

import "../pool-utils/BaseMinimalSwapInfoPool.sol";
import "./interfaces/ContinuousPoolUserData.sol";

abstract contract ContinuousPool is BaseMinimalSwapInfoPool {
  // using FixedPoint for uint256;
  using ContinuousPoolUserData for bytes;

  constructor(
    IVault vault,
    string memory name,
    string memory symbol,
    IERC20[] memory tokens,
    address[] memory assetManagers,
    uint256 swapFeePercentage,
    uint256 pauseWindowDuration,
    uint256 bufferPeriodDuration,
    address owner
  )
    BasePool(
      vault,
      IVault.PoolSpecialization.TWO_TOKEN,
      name,
      symbol,
      tokens,
      assetManagers,
      swapFeePercentage,
      pauseWindowDuration,
      bufferPeriodDuration,
      owner
    )
  {
    // solhint-disable-previous-line no-empty-blocks
  }

  //Implement Base Pool Handlers

  // Swap Handlers
  function _onSwapGivenIn(
    SwapRequest memory swapRequest,
    uint256 currentBalanceTokenIn,
    uint256 currentBalanceTokenOut
  ) internal view virtual override returns (uint256) {
    // Swaps are disabled while the contract is paused.

    return 1e18;
    // WeightedMath._calcOutGivenIn(
    //     currentBalanceTokenIn,
    //     _getNormalizedWeight(swapRequest.tokenIn),
    //     currentBalanceTokenOut,
    //     _getNormalizedWeight(swapRequest.tokenOut),
    //     swapRequest.amount
    // );
  }

  function _onSwapGivenOut(
    SwapRequest memory swapRequest,
    uint256 currentBalanceTokenIn,
    uint256 currentBalanceTokenOut
  ) internal view virtual override returns (uint256) {
    // Swaps are disabled while the contract is paused.

    return 1e18;
    // WeightedMath._calcInGivenOut(
    //     currentBalanceTokenIn,
    //     _getNormalizedWeight(swapRequest.tokenIn),
    //     currentBalanceTokenOut,
    //     _getNormalizedWeight(swapRequest.tokenOut),
    //     swapRequest.amount
    // );
  }

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

  // Initialize

  function _onInitializePool(
    bytes32,
    address,
    address,
    bytes memory userData
  ) internal virtual override whenNotPaused returns (uint256, uint256[] memory) {
    // It would be strange for the Pool to be paused before it is initialized, but for consistency we prevent
    // initialization in this case.

    ContinuousPoolUserData.JoinKind kind = userData.joinKind();
    _require(kind == ContinuousPoolUserData.JoinKind.INIT, Errors.UNINITIALIZED);

    uint256[] memory amountsIn = userData.initialAmountsIn();
    InputHelpers.ensureInputLengthMatch(_getTotalTokens(), amountsIn.length);

    uint256 bptAmountOut = 10e18;

    return (bptAmountOut, amountsIn);
  }

  function _onJoinPool(
    bytes32,
    address,
    address,
    uint256[] memory,
    uint256,
    uint256,
    bytes memory
  ) internal pure override returns (uint256, uint256[] memory) {
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
  ) internal virtual override returns (uint256, uint256[] memory) {
    require(sender == getOwner(), "Not Fee Reciever");

    _beforeJoinExit(balances, protocolSwapFeePercentage);

    //Fee Collector Contract functions
    uint256[] memory amountsOut = new uint256[](balances.length);
    amountsOut[0] = 1e18;
    amountsOut[1] = 1e18;

    _afterJoinExit(false, balances, amountsOut);

    uint256 bptAmountIn = 1e18;
    return (bptAmountIn, amountsOut);
  }
}
