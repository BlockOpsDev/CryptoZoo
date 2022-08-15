// // SPDX-License-Identifier: Unlicenced

// pragma solidity ^0.7.0;
// pragma experimental ABIEncoderV2;

// import "@balancer-labs/v2-solidity-utils/contracts/math/FixedPoint.sol";
// import "@balancer-labs/v2-solidity-utils/contracts/helpers/InputHelpers.sol";

// import "@balancer-labs/v2-pool-utils/contracts/BaseMinimalSwapInfoPool.sol";

// import "./interfaces/ContinuousPoolUserData.sol";

// abstract contract ContinuousPool is BaseMinimalSwapInfoPool {
//   using FixedPoint for uint256;
//   using ContinuousPoolUserData for bytes;

//   constructor(
//     IVault vault,
//     string memory name,
//     string memory symbol,
//     IERC20[] memory tokens,
//     address[] memory assetManagers,
//     uint256 swapFeePercentage,
//     uint256 pauseWindowDuration,
//     uint256 bufferPeriodDuration,
//     address owner
//   )
//     BasePool(
//       vault,
//       tokens.length == 2 ? IVault.PoolSpecialization.TWO_TOKEN : IVault.PoolSpecialization.MINIMAL_SWAP_INFO,
//       name,
//       symbol,
//       tokens,
//       assetManagers,
//       swapFeePercentage,
//       pauseWindowDuration,
//       bufferPeriodDuration,
//       owner
//     )
//   {
//     // solhint-disable-previous-line no-empty-blocks
//   }

//   //Implement Base Pool Handlers

//   // Swap Handlers
//   function _onSwapGivenIn(
//     SwapRequest memory swapRequest,
//     uint256 currentBalanceTokenIn,
//     uint256 currentBalanceTokenOut
//   ) internal view virtual override whenNotPaused returns (uint256) {
//     // Swaps are disabled while the contract is paused.

//     return 1;
//     // WeightedMath._calcOutGivenIn(
//     //     currentBalanceTokenIn,
//     //     _getNormalizedWeight(swapRequest.tokenIn),
//     //     currentBalanceTokenOut,
//     //     _getNormalizedWeight(swapRequest.tokenOut),
//     //     swapRequest.amount
//     // );
//   }

//   function _onSwapGivenOut(
//     SwapRequest memory swapRequest,
//     uint256 currentBalanceTokenIn,
//     uint256 currentBalanceTokenOut
//   ) internal view virtual override whenNotPaused returns (uint256) {
//     // Swaps are disabled while the contract is paused.

//     return 1;
//     // WeightedMath._calcInGivenOut(
//     //     currentBalanceTokenIn,
//     //     _getNormalizedWeight(swapRequest.tokenIn),
//     //     currentBalanceTokenOut,
//     //     _getNormalizedWeight(swapRequest.tokenOut),
//     //     swapRequest.amount
//     // );
//   }

//   // Initialize

//   function _onInitializePool(
//     bytes32,
//     address,
//     address,
//     uint256[] memory scalingFactors,
//     bytes memory userData
//   ) internal virtual override whenNotPaused returns (uint256, uint256[] memory) {
//     // It would be strange for the Pool to be paused before it is initialized, but for consistency we prevent
//     // initialization in this case.

//     ContinuousPoolUserData.JoinKind kind = userData.joinKind();
//     _require(kind == ContinuousPoolUserData.JoinKind.INIT, Errors.UNINITIALIZED);

//     uint256[] memory amountsIn = userData.initialAmountsIn();
//     InputHelpers.ensureInputLengthMatch(_getTotalTokens(), amountsIn.length);
//     _upscaleArray(amountsIn, scalingFactors);

//     (uint256[] memory normalizedWeights, ) = _getNormalizedWeightsAndMaxWeightIndex();

//     uint256 invariantAfterJoin = WeightedMath._calculateInvariant(normalizedWeights, amountsIn);

//     // Set the initial BPT to the value of the invariant times the number of tokens. This makes BPT supply more
//     // consistent in Pools with similar compositions but different number of tokens.
//     uint256 bptAmountOut = Math.mul(invariantAfterJoin, _getTotalTokens());

//     _lastInvariant = invariantAfterJoin;

//     return (bptAmountOut, amountsIn);
//   }

//   function _onJoinPool(
//     bytes32,
//     address,
//     address,
//     uint256[] memory,
//     uint256,
//     uint256,
//     uint256[] memory,
//     bytes memory
//   ) internal pure override returns (uint256, uint256[] memory) {
//     _revert(Errors.UNHANDLED_JOIN_KIND);
//   }
// }
