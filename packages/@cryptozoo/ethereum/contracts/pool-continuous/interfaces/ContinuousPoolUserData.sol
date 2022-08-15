// SPDX-License-Identifier: Unlicenced

pragma solidity ^0.7.0;

import "@balancer-labs/v2-solidity-utils/contracts/openzeppelin/IERC20.sol";

library ContinuousPoolUserData {
  enum JoinKind {
    INIT,
    EXACT_TOKENS_IN_FOR_BPT_OUT,
    TOKEN_IN_FOR_EXACT_BPT_OUT,
    ALL_TOKENS_IN_FOR_EXACT_BPT_OUT,
    ADD_TOKEN // for Managed Pool
  }

  enum ExitKind {
    EXACT_BPT_IN_FOR_ONE_TOKEN_OUT,
    EXACT_BPT_IN_FOR_TOKENS_OUT,
    BPT_IN_FOR_EXACT_TOKENS_OUT,
    REMOVE_TOKEN // for ManagedPool
  }

  function joinKind(bytes memory self) internal pure returns (JoinKind) {
    return abi.decode(self, (JoinKind));
  }

  function exitKind(bytes memory self) internal pure returns (ExitKind) {
    return abi.decode(self, (ExitKind));
  }

  // Joins

  function initialAmountsIn(bytes memory self) internal pure returns (uint256[] memory amountsIn) {
    (, amountsIn) = abi.decode(self, (JoinKind, uint256[]));
  }

  function exactTokensInForBptOut(bytes memory self)
    internal
    pure
    returns (uint256[] memory amountsIn, uint256 minBPTAmountOut)
  {
    (, amountsIn, minBPTAmountOut) = abi.decode(self, (JoinKind, uint256[], uint256));
  }

  function tokenInForExactBptOut(bytes memory self) internal pure returns (uint256 bptAmountOut, uint256 tokenIndex) {
    (, bptAmountOut, tokenIndex) = abi.decode(self, (JoinKind, uint256, uint256));
  }

  function allTokensInForExactBptOut(bytes memory self) internal pure returns (uint256 bptAmountOut) {
    (, bptAmountOut) = abi.decode(self, (JoinKind, uint256));
  }

  function addToken(bytes memory self) internal pure returns (uint256 amountIn) {
    (, amountIn) = abi.decode(self, (JoinKind, uint256));
  }

  // Exits

  function exactBptInForTokenOut(bytes memory self) internal pure returns (uint256 bptAmountIn, uint256 tokenIndex) {
    (, bptAmountIn, tokenIndex) = abi.decode(self, (ExitKind, uint256, uint256));
  }

  function exactBptInForTokensOut(bytes memory self) internal pure returns (uint256 bptAmountIn) {
    (, bptAmountIn) = abi.decode(self, (ExitKind, uint256));
  }

  function bptInForExactTokensOut(bytes memory self)
    internal
    pure
    returns (uint256[] memory amountsOut, uint256 maxBPTAmountIn)
  {
    (, amountsOut, maxBPTAmountIn) = abi.decode(self, (ExitKind, uint256[], uint256));
  }

  // Managed Pool
  function removeToken(bytes memory self) internal pure returns (uint256 tokenIndex) {
    (, tokenIndex) = abi.decode(self, (ExitKind, uint256));
  }
}