// // SPDX-License-Identifier: Unlicenced

// pragma solidity ^0.8.0;
// pragma experimental ABIEncoderV2;

// import "../pool-continuous/ContinuousPool.sol";

// contract Keeper is ContinuousPool {
//   uint256 private constant _MAX_TOKENS = 2;

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
//     ContinuousPool(
//       vault,
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

  // function _getTotalTokens() internal view override returns (uint256) {
  //   return _MAX_TOKENS;
  // }

  // function _getMaxTokens() internal pure override returns (uint256) {
  //   return 2;
  // }
// }
