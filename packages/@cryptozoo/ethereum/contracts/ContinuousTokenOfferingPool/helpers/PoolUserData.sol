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

library PoolUserData {
  enum JoinKind {
    INIT_PHANTOM_SUPPLY
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

  // Join

  function initialAmounts(bytes memory self) internal pure returns (uint256 phantomSupply, uint256 startSupply) {
    (, phantomSupply, startSupply) = abi.decode(self, (JoinKind, uint256, uint256));
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
